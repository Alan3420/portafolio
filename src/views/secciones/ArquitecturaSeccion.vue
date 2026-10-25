<script setup>
import { ref } from 'vue'
import { escenas } from '../../config'
import { usarDiagrama } from '../../controllers/usarDiagrama'
import { cajaEnPorcentaje, nodos } from '../../models/arquitectura'
import LienzoPintado from '../componentes/LienzoPintado.vue'

import presa from '../../assets/img/presa.webp'
import presaMovil from '../../assets/img/presa-1280.webp'
import presaProf from '../../assets/img/presa-prof.webp'

const seccion = ref(null)
const svg = ref(null)
const { disposicion, pulso, tuboActivo } = usarDiagrama({ seccion, svg })
</script>

<template>
  <section ref="seccion" class="arq" data-mundo="transicion" aria-labelledby="arq-titulo">
    <LienzoPintado :color="presa" :color-movil="presaMovil" :prof="presaProf" :ajustes="escenas.presa" />
    <div class="arq__velo" aria-hidden="true"></div>

    <div class="envoltura">
      <h3 id="arq-titulo" class="arq__titulo">Game Rank por dentro</h3>
      <p class="arq__intro">
        El recorrido de una petición en el despliegue real: del navegador a la API, y de ahí a la base de datos o a
        RAWG. Los tests de GitHub Actions protegen la API en cada push.
      </p>

      <div class="arq__mapa" :style="{ aspectRatio: `${disposicion.ancho} / ${disposicion.alto}` }">
        <svg ref="svg" class="arq__tubos" :viewBox="`0 0 ${disposicion.ancho} ${disposicion.alto}`" aria-hidden="true">
          <g v-for="t in disposicion.tubos" :key="t.id" :class="{ 'tubo--activo': tuboActivo === t.id }" class="tubo">
            <path :d="t.d" class="tubo__exterior" />
            <path :d="t.d" class="tubo__interior" :data-tubo="t.id" />
            <path :d="t.d" class="tubo__brillo" />
            <text v-if="t.etiqueta" :x="t.posEtiqueta[0]" :y="t.posEtiqueta[1]" class="tubo__etiqueta">
              {{ t.etiqueta }}
            </text>
          </g>
          <g v-if="pulso.visible" :transform="`translate(${pulso.x} ${pulso.y})`" class="pulso">
            <circle r="16" class="pulso__halo" />
            <path d="M0 -11 Q0 0 8 0 Q0 0 0 11 Q0 0 -8 0 Q0 0 0 -11Z" class="pulso__estrella" />
          </g>
        </svg>

        <div
          v-for="n in nodos"
          :key="n.id"
          class="nodo"
          :class="`nodo--${n.id}`"
          :style="cajaEnPorcentaje(disposicion, n.id)"
        >
          <p class="nodo__titulo">{{ n.titulo }}</p>
          <p class="nodo__tec">{{ n.tec }}</p>
          <p class="nodo__host">{{ n.host }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.arq {
  position: relative;
  isolation: isolate;
  padding-block: clamp(6rem, 16vh, 10rem);
}

.arq__velo {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 55%,
    color-mix(in srgb, var(--fondo) 55%, transparent),
    color-mix(in srgb, var(--fondo) 25%, transparent) 70%
  );
}

.arq__titulo {
  font-size: var(--t-5);
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 0.06em 0.5em rgb(0 0 0 / 0.6);
}

.arq__intro {
  max-width: 40rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
  text-shadow: 0 1px 12px rgb(0 0 0 / 0.8);
}

.arq__mapa {
  position: relative;
  width: 100%;
}

.arq__tubos {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.tubo path {
  fill: none;
  stroke-linecap: round;
}

.tubo__exterior {
  stroke: #061012;
  stroke-width: 16;
}

.tubo__interior {
  stroke: var(--laton);
  stroke-width: 9;
  opacity: 0.55;
  transition:
    opacity 0.2s,
    stroke 0.2s;
}

.tubo__brillo {
  stroke: #fff1d6;
  stroke-width: 1.5;
  opacity: 0.35;
  transform: translateY(-2.5px);
}

.tubo--activo .tubo__interior {
  stroke: var(--acento);
  opacity: 1;
}

.tubo__etiqueta {
  text-anchor: middle;
  fill: var(--texto);
  font: 600 15px var(--f-cuerpo);
  paint-order: stroke;
  stroke: #061012;
  stroke-width: 5px;
}

.pulso__halo {
  fill: var(--acento);
  opacity: 0.35;
  filter: blur(4px);
}

.pulso__estrella {
  fill: #fff6e0;
}

.nodo {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.7rem 1rem;
  background: linear-gradient(160deg, color-mix(in srgb, var(--fondo-2) 96%, white 4%), var(--fondo));
  border: 1px solid color-mix(in srgb, var(--laton) 55%, transparent);
  border-radius: 6px 14px 6px 14px;
  box-shadow:
    inset 0 1px 0 rgb(255 240 210 / 0.12),
    0 1rem 2rem -0.8rem rgb(0 0 0 / 0.8);
}

/* remaches en las esquinas */
.nodo::before,
.nodo::after {
  content: '';
  position: absolute;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f3d39a, #6b4a1c);
}

.nodo::before {
  left: 7px;
}

.nodo::after {
  right: 7px;
}

.nodo__titulo {
  font: 800 clamp(1.05rem, 1.6vw, 1.35rem) / 1.05 var(--f-display);
  margin-bottom: 0.3rem;
}

.nodo__tec {
  font-size: 0.82rem;
  line-height: 1.3;
  color: var(--texto);
}

.nodo__host {
  font-size: 0.78rem;
  color: var(--acento);
  font-weight: 600;
  margin-top: 0.2rem;
}

@media (max-width: 979px) {
  .tubo__etiqueta {
    font-size: 22px;
  }

  .nodo {
    padding: 0.6rem 0.75rem;
  }
}
</style>
