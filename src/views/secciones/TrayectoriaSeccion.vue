<script setup>
import { ref } from 'vue'
import { usarTrazoTrayectoria } from '../../controllers/usarTrazoTrayectoria'
import { trayectoria } from '../../models/perfil'

const seccion = ref(null)
usarTrazoTrayectoria(seccion)
</script>

<template>
  <section id="trayectoria" ref="seccion" class="tray" data-mundo="transicion" aria-labelledby="tray-titulo">
    <div class="envoltura tray__rejilla">
      <h2 id="tray-titulo" class="tray__titulo">Trayectoria</h2>
      <div class="tray__lista">
        <span class="tray__trazo" aria-hidden="true"></span>
        <ol class="tray__hitos">
          <li v-for="h in trayectoria" :key="h.titulo" class="hito">
            <p class="hito__fecha">{{ h.fecha }}</p>
            <h3 class="hito__titulo">{{ h.titulo }}</h3>
            <p class="hito__lugar">{{ h.lugar }}</p>
            <ul class="hito__puntos">
              <li v-for="p in h.puntos" :key="p">{{ p }}</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tray {
  padding-block: clamp(5rem, 12vh, 8rem);
}

.tray__rejilla {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: clamp(2rem, 6vw, 5rem);
}

.tray__titulo {
  font-size: var(--t-5);
  font-weight: 900;
  position: sticky;
  top: 6rem;
  align-self: start;
}

.tray__lista {
  position: relative;
  padding-left: 2.4rem;
}

.tray__hitos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 3.5rem;
}

.tray__lista::before,
.tray__trazo {
  content: '';
  position: absolute;
  left: 0.45rem;
  top: 0.6rem;
  bottom: 0;
  width: 3px;
  background: var(--linea);
}

.tray__trazo {
  background: var(--acento);
  transform-origin: top;
}

.hito {
  position: relative;
}

.hito::before {
  content: '';
  position: absolute;
  left: -2.4rem;
  top: 0.35rem;
  width: 1.2rem;
  height: 1.2rem;
  background: var(--fondo);
  border: 3px solid var(--acento);
  transform: rotate(45deg);
}

.hito__fecha {
  font-weight: 600;
  color: var(--acento);
  margin-bottom: 0.4rem;
}

.hito__titulo {
  font-size: var(--t-3);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 0.35rem;
}

.hito__lugar {
  color: var(--texto-suave);
  margin-bottom: 1rem;
}

.hito__puntos {
  display: grid;
  gap: 0.5rem;
  max-width: 40rem;
}

.hito__puntos li {
  position: relative;
  padding-left: 1.2rem;
}

.hito__puntos li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.72em;
  width: 0.55rem;
  height: 2px;
  background: var(--texto-suave);
}

@media (max-width: 760px) {
  .tray__rejilla {
    grid-template-columns: 1fr;
  }

  .tray__titulo {
    position: static;
  }
}
</style>
