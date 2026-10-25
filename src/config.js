// Parámetros ajustables del portafolio. Ningún componente debe llevar números
// mágicos: si un valor se puede afinar, vive aquí.

// Cadencia de los efectos "dibujados" (chispas, pulso del diagrama, entradas por fotogramas)
export const FPS_DIBUJO = 30

// Resolución máxima del lienzo WebGL y del de chispas (densidad de píxeles)
export const DPR_MAX_WEBGL = 1.75
export const DPR_MAX_CHISPAS = 2

// A partir de este ancho en píxeles físicos se cargan las imágenes de 2400 px
export const ANCHO_IMAGEN_GRANDE = 1400

// Distancia (px) a la vista a la que se crean los fondos pintados de las secciones
export const MARGEN_CARGA_LIENZO = 600

// Debe coincidir con el @media de ArquitecturaSeccion.vue
export const ANCHO_DIAGRAMA_HORIZONTAL = 980

// Renderizado de las escenas pintadas
export const render = {
  colorFarol: [1.0, 0.62, 0.3],
  colorBorde: [0.31, 0.82, 0.77],
  corte: [0.22, 0.32], // umbrales de profundidad pared/figura del retrato
  margenParalaje: 1.6, // cuánto se amplía el recorte por unidad de paralaje
  anclaRetrato: 0.15, // posición vertical del recorte del retrato (0 = arriba)
  suavizadoCamara: 0.06,
  suavizadoFarol: 0.12,
  luzInicial: { x: 0.62, y: 0.32 },
  // deriva automática cuando no hay ratón (pantallas táctiles)
  deriva: { camara: [0.35, 0.27, 0.5, 0.3], farol: [0.3, 0.4, 0.2, 0.12], centro: [0.55, 0.35] },
}

export const escenas = {
  heroFondo: { parallax: 0.03, anclaY: 0.55, farol: 1 },
  heroRetrato: { parallax: 0.028, farol: 0.9 },
  presa: { parallax: 0.045, farol: 0.8, semilla: 17 },
  puente: { parallax: 0.04, anclaY: 0.6, farol: 0.8, colorFarol: [1.0, 0.75, 0.4], semilla: 29 },
}

// Desplazamiento de cámara de los lienzos según el progreso del scroll
export const scrollLienzo = { vertical: 2.2, horizontal: -0.8 }

export const hero = {
  scroll: { fondo: 1.4, retrato: 0.6, nombre: -35, pie: -15, opacidadPie: 0.15 },
  entrada: {
    revelarFondo: 1.5,
    revelarRetrato: 1.2,
    retrasoRetrato: 0.35,
    letra: 0.45,
    escalonLetras: 0.04,
    inicioLetras: 0.2,
    caidaLetra: [30, 70], // % de su altura desde donde cae cada letra
    giroLetra: 12, // grados máximos de giro inicial
    inicioTexto: 0.7,
    texto: { duracion: 0.7, subida: 20, escalon: 0.08 },
  },
  esperaFuentesMs: 1500,
}

export const chispas = {
  cantidad: 34,
  colores: ['#ff7a2f', '#ffc06b', '#4fd1c5'],
  probabilidadFria: 0.18,
  probabilidadClara: 0.4,
  probabilidadDestello: 0.08,
  velocidadX: 160, // px/s, rango total
  velocidadY: [260, 780], // px/s hacia arriba
  vida: [1.2, 3.6], // s
  tamano: [1.2, 3.6], // px
  viento: 900, // px/s² de ráfaga máxima
  rozamiento: 0.6,
  pasoMaximo: 0.1, // s; evita saltos al volver a una pestaña inactiva
}

export const pulso = { segundosPorTramo: 0.9, pausaFinal: 0.8 }

// Entradas por fotogramas de las secciones (s)
export const entradas = {
  nodo: { duracion: 0.42, escalon: 0.09 },
  mancha: { duracion: 0.5, escalon: 0.12 },
  subrayado: { duracion: 0.6 },
}

// Pantallas de Game Rank: giro inicial y final de cada una al hacer scroll
export const pantallasGameRank = {
  desde: [
    { rotateY: -28, rotateZ: -6, yPercent: 18 },
    { rotateY: -22, rotateZ: 2, yPercent: 28 },
    { rotateY: -16, rotateZ: 7, yPercent: 38 },
  ],
  hasta: [
    { rotateY: -8, rotateZ: -4, yPercent: 6 },
    { rotateY: 0, rotateZ: 0, yPercent: -6 },
    { rotateY: 8, rotateZ: 4, yPercent: 4 },
  ],
  profundidad: -120,
  suavizado: 0.6,
}

// Semillas de las máscaras de pincel: mismas formas en cada visita
export const semillasPincel = { boton: 7, subrayado: 21, manchas: [21, 34, 55] }

// Paleta por "mundo": de la ciudad baja (azul verdoso y neón) a la alta (latón)
export const paletas = {
  baja: { '--fondo': '#0f1d22', '--fondo-2': '#16292f', '--acento': '#4fd1c5', '--acento-2': '#f0508a' },
  transicion: { '--fondo': '#1b1a26', '--fondo-2': '#252233', '--acento': '#8fc9e8', '--acento-2': '#f0508a' },
  alta: { '--fondo': '#241914', '--fondo-2': '#30221a', '--acento': '#e2a64a', '--acento-2': '#ff7a2f' },
}
export const transicionPaleta = 1.1 // s

export const scrollSuave = { lerp: 0.1, duracionSalto: 1.4, margenSalto: -8 }

export const navegacion = { umbralCompacta: 40, umbralOcultar: 400 }

export const copiarCorreo = { avisoMs: 2200 }
