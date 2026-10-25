// Controlador global de movimiento: registra GSAP, gestiona el scroll suave
// (Lenis) y la paleta de colores que cambia con el scroll.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { paletas, scrollSuave, transicionPaleta } from '../config'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export const movimientoReducido = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null
let avanceLenis = null

export function iniciarScrollSuave() {
  if (movimientoReducido() || lenis) return lenis
  lenis = new Lenis({ autoRaf: false, lerp: scrollSuave.lerp })
  lenis.on('scroll', ScrollTrigger.update)
  avanceLenis = (t) => lenis.raf(t * 1000)
  gsap.ticker.add(avanceLenis)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function detenerScrollSuave() {
  if (!lenis) return
  gsap.ticker.remove(avanceLenis)
  lenis.destroy()
  lenis = null
  avanceLenis = null
}

export function irA(destino) {
  const el = typeof destino === 'string' ? document.querySelector(destino) : destino
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: scrollSuave.margenSalto, duration: scrollSuave.duracionSalto })
  else el.scrollIntoView({ behavior: movimientoReducido() ? 'auto' : 'smooth' })
  // el foco acompaña al salto para lectores de pantalla y teclado
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

// Cada sección con data-mundo="baja|transicion|alta" cambia la paleta al entrar.
// Devuelve una función que elimina los disparadores.
export function iniciarPaletaScroll() {
  const raiz = document.documentElement
  const disparadores = [...document.querySelectorAll('[data-mundo]')].map((seccion) =>
    ScrollTrigger.create({
      trigger: seccion,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (st) => {
        if (!st.isActive) return
        gsap.to(raiz, {
          ...paletas[seccion.dataset.mundo],
          duration: movimientoReducido() ? 0 : transicionPaleta,
          ease: 'sine.inOut',
          overwrite: 'auto',
        })
      },
    }),
  )
  return () => disparadores.forEach((d) => d.kill())
}
