import { onBeforeUnmount, onMounted } from 'vue'
import { entradas, pantallasGameRank as cfg } from '../config'
import { pasos } from '../models/animacion'
import { gsap, movimientoReducido } from './movimiento'

// Game Rank: las pantallas llegan giradas en 3D y se enderezan con el scroll;
// las manchas de pintura y el subrayado aparecen fotograma a fotograma.
export function usarAnimacionesGameRank(seccion) {
  let contexto = null

  onMounted(() => {
    if (movimientoReducido()) return
    contexto = gsap.context(() => {
      gsap.utils.toArray('.pantalla').forEach((pantalla, i) => {
        gsap.fromTo(
          pantalla,
          { ...cfg.desde[i], z: cfg.profundidad },
          {
            ...cfg.hasta[i],
            z: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.gr__pantallas', start: 'top 95%', end: 'center 45%', scrub: cfg.suavizado },
          },
        )
      })
      gsap.from('.pantalla__mancha', {
        clipPath: 'inset(0 100% 0 0)',
        duration: entradas.mancha.duracion,
        ease: pasos(entradas.mancha.duracion),
        stagger: entradas.mancha.escalon,
        scrollTrigger: { trigger: '.gr__pantallas', start: 'top 70%' },
      })
      gsap.from('.gr__subrayado', {
        clipPath: 'inset(0 100% 0 0)',
        duration: entradas.subrayado.duracion,
        ease: pasos(entradas.subrayado.duracion),
        scrollTrigger: { trigger: '.gr__titulo', start: 'top 80%' },
      })
    }, seccion.value)
  })

  onBeforeUnmount(() => contexto?.revert())
}
