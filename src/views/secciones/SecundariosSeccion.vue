<script setup>
import { secundarios } from '../../models/perfil'
import IconoSvg from '../componentes/IconoSvg.vue'
</script>

<template>
  <section class="sec" data-mundo="transicion" aria-labelledby="sec-titulo">
    <div class="envoltura">
      <h2 id="sec-titulo" class="sec__titulo">Otros proyectos</h2>
      <div class="sec__rejilla">
        <article v-for="p in secundarios" :key="p.nombre" class="proyecto">
          <header class="proyecto__cabecera">
            <h3 class="proyecto__nombre">{{ p.nombre }}</h3>
            <span class="anotacion proyecto__nota">{{ p.nota }}</span>
          </header>
          <p class="proyecto__desc">{{ p.descripcion }}</p>
          <ul class="proyecto__puntos">
            <li v-for="punto in p.puntos" :key="punto">{{ punto }}</li>
          </ul>
          <p class="proyecto__stack">{{ p.stack.join(', ') }}</p>
          <a class="proyecto__enlace" :href="p.codigo" target="_blank" rel="noopener">
            <IconoSvg nombre="github" />
            Ver el código de {{ p.nombre }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  padding-block: clamp(5rem, 12vh, 8rem);
}

.sec__titulo {
  font-size: var(--t-5);
  font-weight: 900;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.sec__rejilla {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2.5rem, 7vw, 6rem);
}

/* el segundo proyecto baja un poco: ritmo de tablón, no de rejilla de tarjetas */
.proyecto:nth-child(2) {
  margin-top: clamp(0rem, 6vw, 5rem);
}

.proyecto__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
  border-bottom: 2px solid var(--linea);
}

.proyecto__nombre {
  font-size: var(--t-4);
  font-weight: 800;
}

.proyecto__nota {
  font-size: var(--t-1);
}

.proyecto__desc {
  margin-bottom: 1.2rem;
  max-width: 34rem;
}

.proyecto__puntos {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1.2rem;
  color: var(--texto-suave);
}

.proyecto__puntos li {
  position: relative;
  padding-left: 1.3rem;
}

.proyecto__puntos li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  width: 0.7rem;
  height: 2px;
  background: var(--acento);
  transform: rotate(-12deg);
}

.proyecto__stack {
  font-size: var(--t-0);
  color: var(--acento);
  font-weight: 600;
  margin-bottom: 1.4rem;
}

.proyecto__enlace {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
  text-decoration-color: color-mix(in srgb, var(--acento) 60%, transparent);
  text-underline-offset: 0.3em;
  text-decoration-thickness: 2px;
  padding-block: 0.4rem;
  transition: color 0.2s;
}

.proyecto__enlace:hover {
  color: var(--acento);
}

.proyecto__enlace svg {
  width: 1.15rem;
  height: 1.15rem;
}

@media (max-width: 760px) {
  .sec__rejilla {
    grid-template-columns: 1fr;
  }

  .proyecto:nth-child(2) {
    margin-top: 0;
  }
}
</style>
