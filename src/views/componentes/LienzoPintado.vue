<script setup>
import { ref } from 'vue'
import { usarLienzoPintado } from '../../controllers/usarLienzoPintado'
import { bordeRasgado } from '../../models/pincel'

const props = defineProps({
  color: { type: String, required: true },
  colorMovil: { type: String, default: '' },
  prof: { type: String, required: true },
  // ajustes de la escena (config.escenas): { parallax, anclaY, farol, colorFarol, semilla }
  ajustes: { type: Object, required: true },
})

const caja = ref(null)
const lienzo = ref(null)
const mascara = bordeRasgado(props.ajustes.semilla, { profundidad: 70 })
const { conWebGL } = usarLienzoPintado(
  { caja, lienzo },
  { ...props.ajustes, color: props.color, colorMovil: props.colorMovil, prof: props.prof },
)
</script>

<template>
  <div
    ref="caja"
    class="lienzo-pintado"
    :style="{ '--mascara': mascara, '--imagen': conWebGL ? 'none' : `url(${colorMovil || color})` }"
    aria-hidden="true"
  >
    <canvas v-if="conWebGL" ref="lienzo"></canvas>
  </div>
</template>

<style scoped>
.lienzo-pintado {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--imagen) center / cover no-repeat;
  -webkit-mask: var(--mascara) center / 100% 100% no-repeat;
  mask: var(--mascara) center / 100% 100% no-repeat;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
