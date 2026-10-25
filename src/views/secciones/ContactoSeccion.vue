<script setup>
import { escenas } from '../../config'
import { usarCopiarCorreo } from '../../controllers/usarCopiarCorreo'
import { persona } from '../../models/perfil'
import IconoSvg from '../componentes/IconoSvg.vue'
import LienzoPintado from '../componentes/LienzoPintado.vue'

import puente from '../../assets/img/ciudad-alta.webp'
import puenteMovil from '../../assets/img/ciudad-alta-1280.webp'
import puenteProf from '../../assets/img/ciudad-alta-prof.webp'

const { copiado, copiar } = usarCopiarCorreo(persona.email)
</script>

<template>
  <section id="contacto" class="cto" data-mundo="alta" aria-labelledby="cto-titulo">
    <LienzoPintado :color="puente" :color-movil="puenteMovil" :prof="puenteProf" :ajustes="escenas.puente" />
    <div class="cto__velo" aria-hidden="true"></div>

    <div class="envoltura cto__contenido">
      <h2 id="cto-titulo" class="cto__titulo">¿Buscas un desarrollador junior?</h2>
      <p class="cto__texto">
        Estoy en {{ persona.ubicacion }} y busco mi primer puesto en backend, frontend o full-stack. Escríbeme y te
        respondo.
      </p>

      <div class="cto__correo">
        <a :href="`mailto:${persona.email}`" class="cto__email">{{ persona.email }}</a>
        <button type="button" class="boton boton--hueco cto__copiar" @click="copiar">
          <IconoSvg nombre="correo" />
          {{ copiado ? 'Correo copiado' : 'Copiar correo' }}
        </button>
        <span class="solo-lectores" aria-live="polite">{{ copiado ? 'Correo copiado al portapapeles' : '' }}</span>
      </div>

      <ul class="cto__enlaces">
        <li>
          <a class="boton" :href="persona.linkedin" target="_blank" rel="noopener">
            <IconoSvg nombre="linkedin" />
            LinkedIn
          </a>
        </li>
        <li>
          <a class="boton boton--hueco" :href="persona.github" target="_blank" rel="noopener">
            <IconoSvg nombre="github" />
            GitHub
          </a>
        </li>
        <li>
          <a class="boton boton--hueco" :href="persona.cv" download>
            <IconoSvg nombre="descargar" />
            Descargar CV
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.cto {
  position: relative;
  isolation: isolate;
  min-height: 92svh;
  display: grid;
  align-items: center;
  padding-block: clamp(7rem, 18vh, 12rem);
}

.cto__velo {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--fondo) 88%, transparent) 0%,
    color-mix(in srgb, var(--fondo) 55%, transparent) 55%,
    transparent 85%
  );
}

.cto__titulo {
  font-size: var(--t-5);
  font-weight: 900;
  max-width: 14ch;
  margin-bottom: 1.4rem;
  text-shadow: 0 0.06em 0.5em rgb(0 0 0 / 0.5);
}

.cto__texto {
  max-width: 32rem;
  font-size: var(--t-2);
  line-height: 1.45;
  margin-bottom: 2.4rem;
}

.cto__correo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.cto__email {
  font: 800 clamp(1.6rem, 5.4vw, 3.4rem) / 1 var(--f-display);
  color: var(--acento);
  text-decoration: none;
  overflow-wrap: anywhere;
  background: linear-gradient(currentColor, currentColor) left bottom / 0 3px no-repeat;
  padding-bottom: 0.15em;
  transition: background-size 0.4s var(--ease-pintura);
}

.cto__email:hover {
  background-size: 100% 3px;
}

.cto__copiar {
  font-size: var(--t-0);
  cursor: pointer;
  border: 0;
  background: none;
}

.cto__enlaces {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem 1.1rem;
}

@media (max-width: 760px) {
  .cto__velo {
    background: color-mix(in srgb, var(--fondo) 72%, transparent);
  }
}
</style>
