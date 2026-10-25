// Renderizador WebGL2 de "pintura con profundidad": cada capa es una imagen pintada
// (Kuwahara precalculado en scripts/pintar.py) más su mapa de profundidad.
// En el navegador solo se hace lo barato: paralaje por profundidad, el farol que
// sigue al cursor, la deriva del trazo y la revelación a pinceladas.

import { DPR_MAX_WEBGL, render } from '../../config'
import { encuadreCover } from '../../models/encuadre'
import { VERTICE, FRAGMENTO } from './shaders'

function compilar(gl, tipo, fuente) {
  const shader = gl.createShader(tipo)
  gl.shaderSource(shader, fuente)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader))
  return shader
}

function cargarImagen(url) {
  return new Promise((ok, ko) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => ok(img)
    img.onerror = ko
    img.src = url
  })
}

export function soportaWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

// capas: [{ color, prof, retrato?, hueco?: () => DOMRect | null, parallax, anclaY, farol, colorFarol, corte }]
export class EscenaPintada {
  constructor(canvas, capas, { estatico = false } = {}) {
    this.canvas = canvas
    this.capas = capas
    this.estatico = estatico
    this.revelado = estatico ? 1 : 0
    this.raton = { x: 0, y: 0, objetivoX: 0, objetivoY: 0 }
    this.luz = { ...render.luzInicial, objetivoX: render.luzInicial.x, objetivoY: render.luzInicial.y }
    this.desplazamiento = { x: 0, y: 0 } // paralaje extra controlado por scroll
    this.hayPuntero = false
    this.activo = false
    this.listo = false
    this.t0 = performance.now()

    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true })
    if (!gl) throw new Error('WebGL2 no disponible')
    this.gl = gl
    const programa = gl.createProgram()
    gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, VERTICE))
    gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO))
    gl.linkProgram(programa)
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(programa))
    this.programa = programa
    this.u = {}
    const total = gl.getProgramParameter(programa, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < total; i++) {
      const nombre = gl.getActiveUniform(programa, i).name
      this.u[nombre] = gl.getUniformLocation(programa, nombre)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW)
    const posicion = gl.getAttribLocation(programa, 'aPos')
    gl.enableVertexAttribArray(posicion)
    gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    this._bucle = this._bucle.bind(this)
    this._observador = new ResizeObserver(() => this.redimensionar())
    this._observador.observe(canvas)
  }

  _textura(img) {
    const gl = this.gl
    const textura = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, textura)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    return textura
  }

  async cargar() {
    await Promise.all(
      this.capas.map(async (capa) => {
        const [color, prof] = await Promise.all([cargarImagen(capa.color), cargarImagen(capa.prof)])
        capa.texturaColor = this._textura(color)
        capa.texturaProf = this._textura(prof)
        capa.aspectoImagen = color.width / color.height
        capa.texel = [1 / prof.width, 1 / prof.height]
      }),
    )
    this.listo = true
    this.redimensionar()
  }

  redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX_WEBGL)
    const caja = this.canvas.getBoundingClientRect()
    this.canvas.width = Math.max(1, Math.round(caja.width * dpr))
    this.canvas.height = Math.max(1, Math.round(caja.height * dpr))
    this.dpr = dpr
    if (this.estatico) this.dibujar()
  }

  puntero(clientX, clientY) {
    const caja = this.canvas.getBoundingClientRect()
    const x = (clientX - caja.left) / caja.width
    const y = (clientY - caja.top) / caja.height
    this.hayPuntero = true
    this.raton.objetivoX = x * 2 - 1
    this.raton.objetivoY = y * 2 - 1
    this.luz.objetivoX = x
    this.luz.objetivoY = y
  }

  iniciar() {
    if (this.activo || this.estatico) return
    this.activo = true
    requestAnimationFrame(this._bucle)
  }

  parar() {
    this.activo = false
  }

  _derivaSinPuntero(t) {
    // sin ratón (táctil): deriva lenta para que la escena siga viva
    const [fcx, fcy, acx, acy] = render.deriva.camara
    const [flx, fly, alx, aly] = render.deriva.farol
    const [cx, cy] = render.deriva.centro
    this.raton.objetivoX = Math.sin(t * fcx) * acx
    this.raton.objetivoY = Math.cos(t * fcy) * acy
    this.luz.objetivoX = cx + Math.sin(t * flx) * alx
    this.luz.objetivoY = cy + Math.cos(t * fly) * aly
  }

  _bucle(ahora) {
    if (!this.activo) return
    const t = (ahora - this.t0) / 1000
    if (!this.hayPuntero) this._derivaSinPuntero(t)
    // la cámara y el farol siguen al objetivo con suavizado, a la frecuencia de la pantalla
    this.raton.x += (this.raton.objetivoX - this.raton.x) * render.suavizadoCamara
    this.raton.y += (this.raton.objetivoY - this.raton.y) * render.suavizadoCamara
    this.luz.x += (this.luz.objetivoX - this.luz.x) * render.suavizadoFarol
    this.luz.y += (this.luz.objetivoY - this.luz.y) * render.suavizadoFarol
    this.dibujar(t)
    requestAnimationFrame(this._bucle)
  }

  _rectanguloCapa(capa, cajaLienzo) {
    if (!capa.hueco) return { x: 0, y: 0, ancho: this.canvas.width, alto: this.canvas.height }
    const hueco = capa.hueco()
    if (!hueco) return null
    return {
      x: (hueco.left - cajaLienzo.left) * this.dpr,
      y: (hueco.top - cajaLienzo.top) * this.dpr,
      ancho: hueco.width * this.dpr,
      alto: hueco.height * this.dpr,
    }
  }

  dibujar(tiempo = 0) {
    if (!this.listo) return
    const { gl, u } = this
    const W = this.canvas.width
    const H = this.canvas.height
    const cajaLienzo = this.canvas.getBoundingClientRect()
    gl.viewport(0, 0, W, H)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.programa)
    gl.uniform2f(u.uRes, W, H)
    gl.uniform1f(u.uTiempo, tiempo)
    gl.uniform1f(u.uRevelado, this.revelado)

    for (const capa of this.capas) {
      const r = this._rectanguloCapa(capa, cajaLienzo)
      if (!r) continue
      const parallax = capa.parallax || 0
      const aspectoRect = r.ancho / r.alto
      const recorte = encuadreCover(aspectoRect, capa.aspectoImagen, {
        margen: 1 - parallax * render.margenParalaje,
        anclaY: capa.retrato ? render.anclaRetrato : (capa.anclaY ?? 0.5),
      })

      gl.uniform4f(u.uRect, r.x, r.y, r.ancho, r.alto)
      gl.uniform4f(u.uCrop, recorte.x, recorte.y, recorte.ancho, recorte.alto)
      gl.uniform2f(u.uTexel, capa.texel[0], capa.texel[1])
      gl.uniform2f(u.uMouse, this.raton.x + this.desplazamiento.x, this.raton.y + this.desplazamiento.y)
      // posición del farol en el espacio uv de esta capa
      gl.uniform2f(u.uLuz, (this.luz.x * W - r.x) / r.ancho, (this.luz.y * H - r.y) / r.alto)
      gl.uniform2f(u.uAspecto, aspectoRect, 1)
      gl.uniform1f(u.uParallax, parallax)
      gl.uniform1f(u.uRetrato, capa.retrato ? 1 : 0)
      gl.uniform1f(u.uFarol, capa.farol ?? 1)
      gl.uniform3fv(u.uColorFarol, capa.colorFarol || render.colorFarol)
      gl.uniform3fv(u.uColorBorde, capa.colorBorde || render.colorBorde)
      gl.uniform2fv(u.uCorte, capa.corte || render.corte)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, capa.texturaColor)
      gl.uniform1i(u.uColor, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, capa.texturaProf)
      gl.uniform1i(u.uProf, 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }

  destruir() {
    this.parar()
    this._observador.disconnect()
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
