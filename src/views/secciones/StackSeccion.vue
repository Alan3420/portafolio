<script setup>
import { idiomas, stack } from '../../models/perfil'
</script>

<template>
  <section class="stk" data-mundo="alta" aria-labelledby="stk-titulo">
    <div class="envoltura">
      <h2 id="stk-titulo" class="stk__titulo">Con qué trabajo</h2>
      <div class="stk__rejilla">
        <div v-for="g in stack" :key="g.capa" class="capa">
          <h3 class="capa__nombre">{{ g.capa }}</h3>
          <ul class="capa__lista">
            <li v-for="i in g.items" :key="i">{{ i }}</li>
          </ul>
        </div>
      </div>
      <p class="stk__idiomas">
        <span v-for="(i, n) in idiomas" :key="i.idioma">
          {{ i.idioma }} <span class="stk__nivel">{{ i.nivel }}</span
          ><template v-if="n < idiomas.length - 1">. </template>
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.stk {
  padding-block: clamp(5rem, 12vh, 8rem);
}

.stk__titulo {
  font-size: var(--t-5);
  font-weight: 900;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.stk__rejilla {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.5rem clamp(1.5rem, 4vw, 3rem);
}

.capa {
  border-top: 3px solid var(--acento);
  padding-top: 1rem;
}

.capa__nombre {
  font-size: var(--t-3);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 1rem;
}

.capa__lista {
  display: grid;
  gap: 0.35rem;
  color: var(--texto-suave);
}

.stk__idiomas {
  margin-top: 3rem;
  font-size: var(--t-2);
  font-family: var(--f-display);
  font-weight: 700;
}

.stk__nivel {
  color: var(--acento);
}

@media (max-width: 900px) {
  .stk__rejilla {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
