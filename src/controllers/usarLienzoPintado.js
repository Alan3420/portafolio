import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ANCHO_IMAGEN_GRANDE, MARGEN_CARGA_LIENZO, scrollLienzo } from '../config'
import { EscenaPintada, soportaWebGL2 } from '../views/graficos/escenaPintada'
import { movimientoReducido, ScrollTrigger } from './movimiento'

// Fondo pintado de una sección. La escena se crea al acercarse a la vista (no al
// cargar la página) y solo se dibuja mientras es visible. El scroll mueve la
// cámara a través de la profundidad y el puntero mueve el farol.
//
// refs: { caja, lienzo }   capa: { color, colorMovil, prof, parallax, anclaY, farol, colorFarol }
export function usarLienzoPintado(refs, capa) {
  const conWebGL = ref(true)
  let escena = null
  let vigiaCarga = null
  let vigiaVisible = null
  let disparador = null
  let seccion = null

  const alMover = (evento) => {
    if (evento.pointerType === 'mouse') escena?.puntero(evento.clientX, evento.clientY)
  }

  async function crearEscena() {
    const reducido = movimientoReducido()
    const grande = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) > ANCHO_IMAGEN_GRANDE
    try {
      escena = new EscenaPintada(
        refs.lienzo.value,
        [{ ...capa, color: grande || !capa.colorMovil ? capa.color : capa.colorMovil }],
        { estatico: reducido },
      )
      escena.revelado = 1
      await escena.cargar()
    } catch (error) {
      console.warn('Lienzo pintado no disponible:', error)
      escena?.destruir()
      escena = null
      conWebGL.value = false
      return
    }
    if (reducido) return

    // el lienzo queda detrás del contenido: el puntero se escucha en la sección
    seccion = refs.caja.value.parentElement
    seccion.addEventListener('pointermove', alMover)

    disparador = ScrollTrigger.create({
      trigger: refs.caja.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (st) => {
        escena.desplazamiento.y = (st.progress - 0.5) * scrollLienzo.vertical
        escena.desplazamiento.x = (st.progress - 0.5) * scrollLienzo.horizontal
      },
    })
    vigiaVisible = new IntersectionObserver(([e]) => (e.isIntersecting ? escena.iniciar() : escena.parar()))
    vigiaVisible.observe(refs.caja.value)
  }

  onMounted(() => {
    conWebGL.value = soportaWebGL2()
    if (!conWebGL.value) return
    vigiaCarga = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        vigiaCarga.disconnect()
        crearEscena()
      },
      { rootMargin: `${MARGEN_CARGA_LIENZO}px` },
    )
    vigiaCarga.observe(refs.caja.value)
  })

  onBeforeUnmount(() => {
    seccion?.removeEventListener('pointermove', alMover)
    vigiaCarga?.disconnect()
    vigiaVisible?.disconnect()
    disparador?.kill()
    escena?.destruir()
  })

  return { conWebGL }
}
