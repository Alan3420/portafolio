import { onBeforeUnmount, onMounted, ref } from 'vue'
import { navegacion } from '../config'
import { irA } from './movimiento'

// Barra superior: compacta al bajar un poco, se oculta al seguir bajando y vuelve al subir.
export function usarNavegacion() {
  const oculta = ref(false)
  const compacta = ref(false)
  let ultimoY = 0

  function alScroll() {
    const y = window.scrollY
    compacta.value = y > navegacion.umbralCompacta
    oculta.value = y > navegacion.umbralOcultar && y > ultimoY
    ultimoY = y
  }

  function navegar(evento, destino) {
    evento.preventDefault()
    irA(destino)
  }

  onMounted(() => window.addEventListener('scroll', alScroll, { passive: true }))
  onBeforeUnmount(() => window.removeEventListener('scroll', alScroll))

  return { oculta, compacta, navegar }
}
