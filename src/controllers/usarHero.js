import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ANCHO_IMAGEN_GRANDE, chispas as cfgChispas, escenas as cfgEscenas, hero as cfgHero } from '../config'
import { pasos } from '../models/animacion'
import { EscenaPintada, soportaWebGL2 } from '../views/graficos/escenaPintada'
import { LienzoChispas } from '../views/graficos/lienzoChispas'
import { gsap, movimientoReducido, ScrollTrigger, SplitText } from './movimiento'

const esperarFuentes = (ms) =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, ms))])

// Controlador del hero: crea las dos escenas pintadas (ciudad y retrato), las
// chispas, la entrada orquestada y el desplazamiento de capas con el scroll.
//
// refs: { seccion, lienzoFondo, lienzoRetrato, lienzoChispas, hueco, titulo }
// imagenes: { ciudad, ciudadMovil, ciudadProf, retrato, retratoProf }
export function usarHero(refs, imagenes) {
  const conWebGL = ref(true)
  const listo = ref(false)
  let escenas = []
  let chispas = null
  let observador = null
  let contexto = null

  function crearEscenas(reducido) {
    const grande = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) > ANCHO_IMAGEN_GRANDE
    return [
      new EscenaPintada(
        refs.lienzoFondo.value,
        [
          {
            ...cfgEscenas.heroFondo,
            color: grande ? imagenes.ciudad : imagenes.ciudadMovil,
            prof: imagenes.ciudadProf,
          },
        ],
        { estatico: reducido },
      ),
      new EscenaPintada(
        refs.lienzoRetrato.value,
        [
          {
            ...cfgEscenas.heroRetrato,
            color: imagenes.retrato,
            prof: imagenes.retratoProf,
            retrato: true,
            hueco: () => refs.hueco.value?.getBoundingClientRect() ?? null,
          },
        ],
        { estatico: reducido },
      ),
    ]
  }

  function entrada() {
    listo.value = true
    if (movimientoReducido()) {
      escenas.forEach((escena) => escena.dibujar())
      return
    }
    const e = cfgHero.entrada
    const [fondo, figura] = escenas
    const partido = new SplitText(refs.titulo.value, { type: 'chars,lines', linesClass: 'hero__linea' })
    const linea = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (fondo) linea.to(fondo, { revelado: 1, duration: e.revelarFondo, ease: 'power2.inOut' }, 0)
    if (figura) linea.to(figura, { revelado: 1, duration: e.revelarRetrato, ease: 'power2.inOut' }, e.retrasoRetrato)
    // cada letra entra por fotogramas: se percibe dibujada, no interpolada
    linea.from(
      partido.chars,
      {
        opacity: 0,
        yPercent: () => gsap.utils.random(...e.caidaLetra),
        rotate: () => gsap.utils.random(-e.giroLetra, e.giroLetra),
        duration: e.letra,
        ease: pasos(e.letra),
        stagger: e.escalonLetras,
      },
      e.inicioLetras,
    )
    linea.from(
      '.hero__aparece',
      { opacity: 0, y: e.texto.subida, duration: e.texto.duracion, stagger: e.texto.escalon },
      e.inicioTexto,
    )

    // al bajar, la cámara sube por la ciudad; cada capa se desplaza a su ritmo
    const s = cfgHero.scroll
    const recorrido = { trigger: refs.seccion.value, start: 'top top', end: 'bottom top', scrub: true }
    ScrollTrigger.create({
      ...recorrido,
      onUpdate: (st) => {
        if (fondo) fondo.desplazamiento.y = st.progress * s.fondo
        if (figura) figura.desplazamiento.y = st.progress * s.retrato
      },
    })
    gsap.to('.hero__nombre', { yPercent: s.nombre, ease: 'none', scrollTrigger: recorrido })
    gsap.to('.hero__pie', { yPercent: s.pie, opacity: s.opacidadPie, ease: 'none', scrollTrigger: recorrido })
  }

  function alMoverPuntero(evento) {
    if (evento.pointerType === 'mouse') escenas.forEach((escena) => escena.puntero(evento.clientX, evento.clientY))
  }

  onMounted(async () => {
    const reducido = movimientoReducido()
    conWebGL.value = soportaWebGL2()
    contexto = gsap.context(() => {}, refs.seccion.value)

    const desactivarWebGL = (error) => {
      console.warn('Escena pintada no disponible:', error)
      escenas.forEach((escena) => escena.destruir())
      escenas = []
      conWebGL.value = false
    }

    // las texturas cargan en paralelo: el texto no espera a las imágenes, solo a las fuentes
    let carga = Promise.resolve()
    if (conWebGL.value) {
      try {
        escenas = crearEscenas(reducido)
        carga = Promise.all(escenas.map((escena) => escena.cargar())).catch(desactivarWebGL)
      } catch (error) {
        desactivarWebGL(error)
      }
    }

    if (!reducido) chispas = new LienzoChispas(refs.lienzoChispas.value, cfgChispas)

    observador = new IntersectionObserver(([registro]) => {
      const accion = registro.isIntersecting ? 'iniciar' : 'parar'
      escenas.forEach((escena) => escena[accion]())
      chispas?.[accion]()
    })
    observador.observe(refs.seccion.value)

    await esperarFuentes(cfgHero.esperaFuentesMs)
    contexto.add(entrada)
    await carga
  })

  onBeforeUnmount(() => {
    observador?.disconnect()
    escenas.forEach((escena) => escena.destruir())
    chispas?.destruir()
    contexto?.revert()
  })

  return { conWebGL, listo, alMoverPuntero }
}
