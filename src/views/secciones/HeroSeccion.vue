<script setup>
import { ref } from 'vue'
import { irA } from '../../controllers/movimiento'
import { usarHero } from '../../controllers/usarHero'
import { persona } from '../../models/perfil'
import IconoSvg from '../componentes/IconoSvg.vue'

import ciudad from '../../assets/img/ciudad-baja.webp'
import ciudadMovil from '../../assets/img/ciudad-baja-1280.webp'
import ciudadProf from '../../assets/img/ciudad-baja-prof.webp'
import retrato from '../../assets/img/retrato.webp'
import retratoProf from '../../assets/img/retrato-prof.webp'
import retratoRecorte from '../../assets/img/retrato-recorte.webp'

// Capas de atrás hacia delante: ciudad, nombre, retrato, chispas, texto.
// El nombre queda detrás de la figura, como en un cartel.
const seccion = ref(null)
const lienzoFondo = ref(null)
const lienzoRetrato = ref(null)
const lienzoChispas = ref(null)
const hueco = ref(null)
const titulo = ref(null)

const { conWebGL, listo, alMoverPuntero } = usarHero(
  { seccion, lienzoFondo, lienzoRetrato, lienzoChispas, hueco, titulo },
  { ciudad, ciudadMovil, ciudadProf, retrato, retratoProf },
)
</script>

<template>
  <section
    id="inicio"
    ref="seccion"
    class="hero"
    :class="{ 'hero--sin-webgl': !conWebGL, 'hero--listo': listo }"
    data-mundo="baja"
    :style="!conWebGL ? { '--fondo-hero': `url(${ciudad1280})` } : null"
    @pointermove="alMoverPuntero"
  >
    <canvas v-show="conWebGL" ref="lienzoFondo" class="hero__capa hero__capa--fondo" aria-hidden="true"></canvas>
    <div class="hero__capa hero__velo" aria-hidden="true"></div>

    <div ref="hueco" class="hero__retrato" role="img" aria-label="Retrato de Alan Novas Mateo">
      <img v-if="!conWebGL" :src="retratoRecorte" alt="" width="960" height="1114" />
    </div>
    <canvas v-show="conWebGL" ref="lienzoRetrato" class="hero__capa hero__capa--retrato" aria-hidden="true"></canvas>
    <canvas ref="lienzoChispas" class="hero__capa hero__capa--chispas" aria-hidden="true"></canvas>

    <!-- columna sin contexto de apilamiento: nombre y pie conservan su capa propia -->
    <div class="hero__columna">
      <h1 ref="titulo" class="hero__nombre">Alan Novas Mateo</h1>

      <div class="hero__pie">
        <p class="hero__rol hero__aparece">{{ persona.rol }}</p>
        <p class="hero__resumen hero__aparece">{{ persona.resumen }}</p>
        <div class="hero__acciones hero__aparece">
          <a class="boton" href="#proyectos" @click.prevent="irA('#proyectos')">
            Ver Game Rank
            <IconoSvg nombre="abajo" />
          </a>
          <a class="boton boton--hueco" :href="persona.cv" download>
            Descargar CV
            <IconoSvg nombre="descargar" />
          </a>
        </div>
        <ul class="hero__redes hero__aparece" aria-label="Perfiles">
          <li>{{ persona.ubicacion }}</li>
          <li>
            <a :href="persona.github" target="_blank" rel="noopener">
              <IconoSvg nombre="github" />
              GitHub
            </a>
          </li>
          <li>
            <a :href="persona.linkedin" target="_blank" rel="noopener">
              <IconoSvg nombre="linkedin" />
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --lado: max(var(--gutter), calc((100vw - var(--max)) / 2 + var(--gutter)));
  position: relative;
  min-height: max(100svh, 40rem);
  overflow: hidden;
  isolation: isolate;
}

.hero__capa {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero__capa--fondo {
  z-index: 0;
}

.hero__velo {
  z-index: 1;
  background:
    linear-gradient(90deg, var(--fondo) 0%, color-mix(in srgb, var(--fondo) 55%, transparent) 40%, transparent 65%),
    linear-gradient(0deg, var(--fondo) 0%, transparent 30%);
}

.hero--sin-webgl {
  background: var(--fondo-hero) center 55% / cover no-repeat;
}

.hero__columna {
  position: absolute;
  inset: 0 auto 0 var(--lado);
  width: min(40rem, 48vw);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding-block: clamp(5.5rem, 13svh, 8rem) clamp(2rem, 6svh, 4rem);
}

/* nombre: capa intermedia, la figura pasa por delante */
.hero__nombre {
  position: relative;
  z-index: 2;
  font-size: clamp(3.4rem, min(10.5vw, 15.5svh), 11rem);
  font-weight: 900;
  line-height: 0.84;
  text-shadow: 0 0.04em 0.35em rgb(0 0 0 / 0.35);
}

.hero:not(.hero--listo) .hero__nombre,
.hero:not(.hero--listo) .hero__aparece {
  visibility: hidden;
}

/* hueco donde WebGL dibuja el retrato */
.hero__retrato {
  position: absolute;
  z-index: 3;
  right: calc(var(--lado) - 2rem);
  bottom: 0;
  width: min(46vw, 44rem);
  height: min(90svh, 60rem);
  pointer-events: none;
}

.hero__retrato img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.hero__capa--retrato {
  z-index: 3;
}

.hero__capa--chispas {
  z-index: 4;
}

.hero__pie {
  position: relative;
  z-index: 5;
  max-width: 34rem;
}

.hero__rol {
  font: 700 var(--t-3) / 1.1 var(--f-display);
  color: var(--acento);
  margin-bottom: 0.8rem;
}

.hero__resumen {
  margin-bottom: 1.6rem;
  text-shadow: 0 1px 10px rgb(0 0 0 / 0.6);
}

.hero__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem 1.1rem;
  margin-bottom: 1.5rem;
}

.hero__redes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1.4rem;
  font-size: var(--t-0);
  color: var(--texto-suave);
}

.hero__redes a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  padding-block: 0.4rem;
  transition: color 0.2s;
}

.hero__redes a:hover {
  color: var(--texto);
}

.hero__redes svg {
  width: 1.05rem;
  height: 1.05rem;
}

@media (max-width: 860px) {
  .hero {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 var(--gutter) 2.5rem;
  }

  .hero__columna {
    position: static;
    width: auto;
    padding: 0;
    display: block;
  }

  .hero__retrato {
    right: -6vw;
    top: 3.5rem;
    bottom: auto;
    width: 100vw;
    max-width: 34rem;
    height: 58svh;
  }

  .hero__velo {
    background: linear-gradient(0deg, var(--fondo) 0%, var(--fondo) 34%, transparent 66%);
  }

  /* en móvil el nombre va delante: la figura ocupa la parte alta */
  .hero__nombre {
    z-index: 4;
    margin-top: 52svh;
    margin-bottom: 1rem;
    font-size: clamp(3.2rem, 15vw, 5.5rem);
  }

  .hero__pie {
    max-width: none;
  }
}
</style>

<style>
.hero__linea {
  padding-bottom: 0.02em;
}
</style>
