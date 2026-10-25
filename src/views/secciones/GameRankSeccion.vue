<script setup>
import { ref } from 'vue'
import { semillasPincel } from '../../config'
import { usarAnimacionesGameRank } from '../../controllers/usarAnimacionesGameRank'
import { gameRank } from '../../models/perfil'
import { trazoPincel } from '../../models/pincel'
import IconoSvg from '../componentes/IconoSvg.vue'

import inicio from '../../assets/img/gamerank-inicio.webp'
import inicio300 from '../../assets/img/gamerank-inicio-300.webp'
import catalogo from '../../assets/img/gamerank-catalogo.webp'
import catalogo300 from '../../assets/img/gamerank-catalogo-300.webp'
import detalle from '../../assets/img/gamerank-detalle.webp'
import detalle300 from '../../assets/img/gamerank-detalle-300.webp'

// cada captura en dos anchos: el navegador elige según el tamaño y la densidad de pantalla
const conjunto = (pequena, grande) => ({ src: grande, srcset: `${pequena} 300w, ${grande} 585w` })
const imagenes = {
  'gamerank-inicio': conjunto(inicio300, inicio),
  'gamerank-catalogo': conjunto(catalogo300, catalogo),
  'gamerank-detalle': conjunto(detalle300, detalle),
}
const subrayado = trazoPincel(semillasPincel.subrayado)
const manchas = semillasPincel.manchas.map((semilla) => trazoPincel(semilla))

const seccion = ref(null)
usarAnimacionesGameRank(seccion)
</script>

<template>
  <section id="proyectos" ref="seccion" class="gr" data-mundo="baja" aria-labelledby="gr-titulo">
    <div class="envoltura">
      <h2 id="gr-titulo" class="gr__titulo">
        {{ gameRank.nombre }}
        <span class="gr__subrayado" :style="{ '--mancha': subrayado }" aria-hidden="true"></span>
      </h2>
      <p class="gr__contexto">{{ gameRank.contexto }}</p>

      <div class="gr__rejilla">
        <div class="gr__texto">
          <p class="gr__descripcion">{{ gameRank.descripcion }}</p>

          <ul class="gr__puntos">
            <li v-for="p in gameRank.puntos" :key="p.titulo">
              <strong>{{ p.titulo }}.</strong>
              {{ p.texto }}
            </li>
          </ul>

          <dl class="gr__stack">
            <div v-for="(items, capa) in gameRank.stack" :key="capa">
              <dt>{{ capa }}</dt>
              <dd>{{ items.join(', ') }}</dd>
            </div>
          </dl>

          <div class="gr__acciones">
            <a class="boton" :href="gameRank.demo" target="_blank" rel="noopener">
              Abrir la demo
              <IconoSvg nombre="externo" />
            </a>
            <a class="boton boton--hueco" :href="gameRank.codigo" target="_blank" rel="noopener">
              <IconoSvg nombre="github" />
              Ver el código
            </a>
            <span class="anotacion gr__nota" aria-hidden="true">en producción</span>
          </div>
        </div>

        <div class="gr__pantallas">
          <figure v-for="(c, i) in gameRank.capturas" :key="c.archivo" class="pantalla" :class="`pantalla--${i}`">
            <span class="pantalla__mancha" :style="{ '--mancha': manchas[i] }" aria-hidden="true"></span>
            <img
              :src="imagenes[c.archivo].src"
              :srcset="imagenes[c.archivo].srcset"
              sizes="(max-width: 860px) 33vw, 190px"
              :alt="c.alt"
              width="585"
              height="1266"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gr {
  position: relative;
  padding-block: clamp(5rem, 14vh, 10rem) clamp(4rem, 10vh, 7rem);
}

.gr__contexto {
  font: 700 var(--t-2) / 1.2 var(--f-display);
  color: var(--acento);
  margin: 1rem 0 clamp(2rem, 5vw, 3.5rem);
}

.gr__titulo {
  position: relative;
  display: inline-block;
  font-size: var(--t-6);
  font-weight: 900;
  line-height: 0.85;
}

.gr__subrayado {
  position: absolute;
  left: -2%;
  right: -4%;
  bottom: 0.02em;
  height: 0.22em;
  z-index: -1;
  background: var(--acento-2);
  opacity: 0.85;
  -webkit-mask: var(--mancha) center / 100% 100% no-repeat;
  mask: var(--mancha) center / 100% 100% no-repeat;
  transform: rotate(-1.2deg);
}

.gr__rejilla {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 5rem);
  align-items: start;
}

.gr__descripcion {
  font-size: var(--t-2);
  line-height: 1.45;
  max-width: 36rem;
  margin-bottom: 2rem;
}

.gr__puntos {
  display: grid;
  gap: 1rem;
  max-width: 38rem;
  margin-bottom: 2.2rem;
}

.gr__puntos li {
  position: relative;
  padding-left: 1.6rem;
  color: var(--texto-suave);
}

.gr__puntos li::before {
  content: '';
  position: absolute;
  left: 0.15rem;
  top: 0.55em;
  width: 0.6rem;
  height: 0.6rem;
  background: var(--acento);
  transform: rotate(45deg) skew(8deg, 8deg);
}

.gr__puntos strong {
  color: var(--texto);
  font-weight: 600;
}

.gr__stack {
  display: grid;
  gap: 0.5rem;
  margin: 0 0 2.4rem;
  padding: 1.1rem 0 0;
  border-top: 1px solid var(--linea);
  font-size: var(--t-0);
}

.gr__stack div {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1rem;
}

.gr__stack dt {
  color: var(--acento);
  font-weight: 600;
}

.gr__stack dd {
  margin: 0;
  color: var(--texto-suave);
}

.gr__acciones {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem 1.1rem;
}

.gr__nota {
  font-size: var(--t-1);
  margin-left: 0.4rem;
  transform: rotate(-7deg) translateY(-0.6rem);
}

.gr__pantallas {
  position: sticky;
  top: max(5rem, calc(50svh - 22rem));
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.6rem, 1.5vw, 1.2rem);
  perspective: 1100px;
  padding-block: 3rem;
}

.pantalla {
  position: relative;
  margin: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.pantalla img {
  position: relative;
  width: 100%;
  border-radius: 1.1rem;
  border: 5px solid #091215;
  box-shadow:
    0 1.4rem 2.5rem -1rem rgb(0 0 0 / 0.7),
    0 0 0 1px rgb(255 255 255 / 0.06);
}

.pantalla__mancha {
  position: absolute;
  inset: 18% -30% auto;
  height: 46%;
  background: var(--acento);
  opacity: 0.55;
  -webkit-mask: var(--mancha) center / 100% 100% no-repeat;
  mask: var(--mancha) center / 100% 100% no-repeat;
  transform: rotate(-14deg) translateZ(-40px);
}

.pantalla--1 .pantalla__mancha {
  background: var(--acento-2);
  transform: rotate(9deg) translateZ(-40px);
  inset: 40% -25% auto;
}

.pantalla--2 .pantalla__mancha {
  background: var(--laton);
  transform: rotate(-6deg) translateZ(-40px);
  inset: 60% -30% auto;
}

@media (max-width: 860px) {
  .gr__rejilla {
    grid-template-columns: 1fr;
  }

  .gr__pantallas {
    position: relative;
    top: 0;
    grid-row: 1;
    max-width: 30rem;
    padding-block: 1rem 2rem;
  }

  .gr__stack div {
    grid-template-columns: 1fr;
    gap: 0.1rem;
  }
}
</style>
