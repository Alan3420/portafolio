<script setup>
import { creditosImagenes, persona } from '../../models/perfil'
</script>

<template>
  <footer class="pie">
    <div class="envoltura pie__rejilla">
      <p>© 2026 {{ persona.nombre }}. Hecho con Vue 3, GSAP y WebGL.</p>
      <p class="pie__creditos">
        Fondos pintados por código a partir de fotografías de dominio público (CC0):
        <template v-for="(c, i) in creditosImagenes" :key="c.fuente">
          <a :href="c.fuente" target="_blank" rel="noopener">{{ c.autor }}</a
          ><template v-if="i < creditosImagenes.length - 1">, </template> </template
        >.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.pie {
  padding-block: 2.5rem 3rem;
  font-size: var(--t-0);
  color: var(--texto-suave);
  border-top: 1px solid var(--linea);
}

.pie__rejilla {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.8rem 2rem;
}

.pie__creditos {
  max-width: 36rem;
}

.pie a {
  text-underline-offset: 0.2em;
}

.pie a:hover {
  color: var(--texto);
}
</style>
