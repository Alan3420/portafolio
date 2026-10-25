import { FPS_DIBUJO } from '../config'

// Ease de GSAP que avanza a `fps` fotogramas por segundo durante `segundos`.
export const pasos = (segundos, fps = FPS_DIBUJO) => `steps(${Math.max(1, Math.round(segundos * fps))})`
