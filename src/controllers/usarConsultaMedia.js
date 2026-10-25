import { onBeforeUnmount, onMounted, ref } from 'vue'

// Estado reactivo de una media query, con el listener eliminado al desmontar.
export function usarConsultaMedia(consulta, inicial = false) {
  const coincide = ref(inicial)
  let lista = null
  const actualizar = (e) => (coincide.value = e.matches)

  onMounted(() => {
    lista = window.matchMedia(consulta)
    coincide.value = lista.matches
    lista.addEventListener('change', actualizar)
  })
  onBeforeUnmount(() => lista?.removeEventListener('change', actualizar))

  return coincide
}
