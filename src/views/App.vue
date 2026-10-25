<script setup>
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { semillasPincel } from '../config'
import { detenerScrollSuave, iniciarPaletaScroll, iniciarScrollSuave, ScrollTrigger } from '../controllers/movimiento'
import { trazoPincel } from '../models/pincel'
import NavSitio from './componentes/NavSitio.vue'
import PieSitio from './componentes/PieSitio.vue'
import HeroSeccion from './secciones/HeroSeccion.vue'
import GameRankSeccion from './secciones/GameRankSeccion.vue'
import ArquitecturaSeccion from './secciones/ArquitecturaSeccion.vue'
import SecundariosSeccion from './secciones/SecundariosSeccion.vue'
import TrayectoriaSeccion from './secciones/TrayectoriaSeccion.vue'
import StackSeccion from './secciones/StackSeccion.vue'
import ContactoSeccion from './secciones/ContactoSeccion.vue'

document.documentElement.style.setProperty('--mascara-pincel', trazoPincel(semillasPincel.boton))
// la entrada del hero es parte de la presentación: siempre se empieza arriba
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

let quitarPaleta = null
const refrescar = () => ScrollTrigger.refresh()

onMounted(async () => {
  await nextTick()
  iniciarScrollSuave()
  quitarPaleta = iniciarPaletaScroll()
  // las fuentes e imágenes cambian alturas: recalcular disparadores al terminar
  document.fonts?.ready.then(refrescar)
  window.addEventListener('load', refrescar, { once: true })
})

onBeforeUnmount(() => {
  quitarPaleta?.()
  detenerScrollSuave()
  window.removeEventListener('load', refrescar)
})
</script>

<template>
  <a class="saltar" href="#proyectos">Saltar al contenido</a>
  <NavSitio />
  <main>
    <HeroSeccion />
    <GameRankSeccion />
    <ArquitecturaSeccion />
    <SecundariosSeccion />
    <TrayectoriaSeccion />
    <StackSeccion />
    <ContactoSeccion />
  </main>
  <PieSitio />
</template>
