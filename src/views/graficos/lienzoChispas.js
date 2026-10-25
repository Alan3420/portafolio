// Renderizador Canvas 2D de las chispas. La física vive en models/particulas.js;
// aquí solo se dibuja, a FPS_DIBUJO fotogramas por segundo.

import { DPR_MAX_CHISPAS, FPS_DIBUJO } from '../../config'
import { avanzarParticula, crearParticula, energia } from '../../models/particulas'

export class LienzoChispas {
  constructor(canvas, cfg) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.cfg = cfg
    this.particulas = []
    this.activo = false
    this.ultimo = 0
    this._bucle = this._bucle.bind(this)
    this._observador = new ResizeObserver(() => this.redimensionar())
    this._observador.observe(canvas)
    this.redimensionar()
    for (let i = 0; i < cfg.cantidad; i++) {
      this.particulas.push(crearParticula(this.ancho, this.alto, cfg, { inicial: true }))
    }
  }

  redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX_CHISPAS)
    const caja = this.canvas.getBoundingClientRect()
    this.ancho = caja.width
    this.alto = caja.height
    this.canvas.width = Math.round(caja.width * dpr)
    this.canvas.height = Math.round(caja.height * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  iniciar() {
    if (this.activo) return
    this.activo = true
    this.ultimo = performance.now()
    requestAnimationFrame(this._bucle)
  }

  parar() {
    this.activo = false
  }

  _bucle(ahora) {
    if (!this.activo) return
    const dt = (ahora - this.ultimo) / 1000
    if (dt >= 1 / FPS_DIBUJO) {
      this.ultimo = ahora
      this._paso(Math.min(dt, this.cfg.pasoMaximo))
    }
    requestAnimationFrame(this._bucle)
  }

  _paso(dt) {
    const { ctx } = this
    ctx.clearRect(0, 0, this.ancho, this.alto)
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    this.particulas.forEach((p, i) => {
      if (!avanzarParticula(p, dt, this.cfg)) {
        this.particulas[i] = crearParticula(this.ancho, this.alto, this.cfg)
        return
      }
      this._dibujar(p, energia(p))
    })
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  _dibujar(p, k) {
    const { ctx } = this
    ctx.globalAlpha = Math.min(1, k * 1.4)
    ctx.strokeStyle = p.color
    ctx.fillStyle = p.color
    ctx.lineWidth = p.tamano * (0.5 + k * 0.5)
    // estela corta y curvada hacia el viento, con un núcleo brillante
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.quadraticCurveTo(p.x - p.vx * 0.008, p.y - p.vy * 0.01, p.x - p.vx * 0.025, p.y - p.vy * 0.018)
    ctx.stroke()
    ctx.globalAlpha *= 0.22
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.tamano * 1.5, 0, Math.PI * 2)
    ctx.fill()
    if (p.destello && Math.sin(p.edad * 9) > 0.6) this._estrella(p.x, p.y, 5 + p.tamano * 3 * k, p.color)
  }

  // destello de cuatro puntas, como los efectos dibujados a mano
  _estrella(x, y, radio, color) {
    const { ctx } = this
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y - radio)
    ctx.quadraticCurveTo(x, y, x + radio * 0.7, y)
    ctx.quadraticCurveTo(x, y, x, y + radio)
    ctx.quadraticCurveTo(x, y, x - radio * 0.7, y)
    ctx.quadraticCurveTo(x, y, x, y - radio)
    ctx.fill()
  }

  destruir() {
    this.parar()
    this._observador.disconnect()
  }
}
