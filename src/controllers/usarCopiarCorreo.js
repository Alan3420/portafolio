import { onBeforeUnmount, ref } from 'vue'
import { copiarCorreo } from '../config'

// Copia el correo al portapapeles; si el navegador no lo permite, abre el cliente de correo.
export function usarCopiarCorreo(email) {
  const copiado = ref(false)
  let temporizador = null

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email)
      copiado.value = true
      clearTimeout(temporizador)
      temporizador = setTimeout(() => (copiado.value = false), copiarCorreo.avisoMs)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  onBeforeUnmount(() => clearTimeout(temporizador))

  return { copiado, copiar }
}
