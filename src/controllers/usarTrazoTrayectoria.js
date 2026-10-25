import { onBeforeUnmount, onMounted } from 'vue'
import { gsap, movimientoReducido } from './movimiento'

// La línea de la trayectoria se pinta a medida que se lee.
export function usarTrazoTrayectoria(seccion) {
  let contexto = null

  onMounted(() => {
    if (movimientoReducido()) return
    contexto = gsap.context(() => {
      gsap.fromTo(
        '.tray__trazo',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tray__lista', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )
    }, seccion.value)
  })

  onBeforeUnmount(() => contexto?.revert())
}
