<script setup>
import { usarNavegacion } from '../../controllers/usarNavegacion'
import { persona } from '../../models/perfil'

const { oculta, compacta, navegar } = usarNavegacion()
</script>

<template>
  <header class="nav" :class="{ 'nav--oculta': oculta, 'nav--compacta': compacta }">
    <a class="nav__firma" href="#inicio" @click="navegar($event, '#inicio')">Alan Novas</a>
    <nav aria-label="Secciones">
      <ul class="nav__lista">
        <li><a href="#proyectos" @click="navegar($event, '#proyectos')">Proyectos</a></li>
        <li><a href="#trayectoria" @click="navegar($event, '#trayectoria')">Trayectoria</a></li>
        <li><a href="#contacto" @click="navegar($event, '#contacto')">Contacto</a></li>
        <li class="nav__cv"><a :href="persona.cv" download>CV</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem var(--gutter);
  transition:
    transform 0.45s var(--ease-pintura),
    padding 0.3s var(--ease-pintura),
    background-color 0.3s;
}

.nav--compacta {
  padding-block: 0.7rem;
  background: color-mix(in srgb, var(--fondo) 82%, transparent);
  backdrop-filter: blur(10px);
}

.nav--oculta {
  transform: translateY(-110%);
}

.nav__firma {
  font: 800 1.45rem/1 var(--f-display);
  text-decoration: none;
  white-space: nowrap;
}

.nav__lista {
  display: flex;
  gap: clamp(0.9rem, 2.5vw, 2rem);
  font-size: var(--t-0);
  font-weight: 500;
}

.nav__lista a {
  position: relative;
  text-decoration: none;
  color: var(--texto);
  opacity: 0.82;
  text-shadow: 0 1px 8px rgb(0 0 0 / 0.7);
  transition: opacity 0.2s;
  padding-block: 0.4rem;
}

.nav__lista a:hover {
  opacity: 1;
}

.nav__lista a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.1rem;
  height: 2px;
  background: var(--acento);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-pintura);
}

.nav__lista a:hover::after {
  transform: scaleX(1);
}

.nav__cv a {
  color: var(--acento);
}

@media (max-width: 420px) {
  .nav__cv {
    display: none;
  }
}
</style>
