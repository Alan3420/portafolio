import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ANCHO_DIAGRAMA_HORIZONTAL, entradas, FPS_DIBUJO, pulso as cfgPulso } from '../config'
import { pasos } from '../models/animacion'
import { disposiciones, estadoPulso } from '../models/arquitectura'
import { gsap, movimientoReducido } from './movimiento'
import { usarConsultaMedia } from './usarConsultaMedia'

// Diagrama de arquitectura: elige la disposición según el ancho, mueve el pulso
// por las tuberías mientras la sección es visible y hace entrar los nodos.
//
// refs: { seccion, svg }
export function usarDiagrama(refs) {
  const ancho = usarConsultaMedia(`(min-width: ${ANCHO_DIAGRAMA_HORIZONTAL}px)`, true)
  const disposicion = computed(() => disposiciones[ancho.value ? 'ancha' : 'estrecha'])
  const pulso = ref({ x: 0, y: 0, visible: false })
  const tuboActivo = ref('')

  let observador = null
  let contexto = null
  let funcionando = false
  let ultimo = 0
  let inicio = 0

  function avanzar(ahora) {
    if (!funcionando) return
    if (ahora - ultimo >= 1000 / FPS_DIBUJO) {
      ultimo = ahora
      const estado = estadoPulso((ahora - inicio) / 1000, cfgPulso)
      const trazado = estado && refs.svg.value?.querySelector(`[data-tubo="${estado.tubo}"]`)
      if (trazado) {
        const punto = trazado.getPointAtLength(estado.fraccion * trazado.getTotalLength())
        pulso.value = { x: punto.x, y: punto.y, visible: true }
        tuboActivo.value = estado.tubo
      } else {
        pulso.value = { ...pulso.value, visible: false }
        tuboActivo.value = ''
      }
    }
    requestAnimationFrame(avanzar)
  }

  onMounted(() => {
    if (movimientoReducido()) return
    observador = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !funcionando) {
        funcionando = true
        inicio = performance.now()
        requestAnimationFrame(avanzar)
      } else if (!e.isIntersecting) {
        funcionando = false
      }
    })
    observador.observe(refs.seccion.value)

    contexto = gsap.context(() => {
      gsap.from('.nodo', {
        opacity: 0,
        scale: 0.85,
        duration: entradas.nodo.duracion,
        ease: pasos(entradas.nodo.duracion),
        stagger: entradas.nodo.escalon,
        scrollTrigger: { trigger: '.arq__mapa', start: 'top 75%' },
      })
    }, refs.seccion.value)
  })

  onBeforeUnmount(() => {
    funcionando = false
    observador?.disconnect()
    contexto?.revert()
  })

  return { disposicion, pulso, tuboActivo }
}
