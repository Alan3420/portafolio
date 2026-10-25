// Máscaras SVG de pincelada generadas con semilla fija: mismas formas en cada visita.

// Trazo de pincel seco (viewBox 400 × 100)
const TRAZO = {
  ancho: 400,
  alto: 100,
  franjas: 22, // cerdas horizontales
  margenVertical: 6,
  solape: 2.5, // cada franja tapa un poco a la siguiente
  irregularidadExtremo: 16,
  recorteFranjaBorde: 18, // la primera y la última franja son más cortas
  probabilidadHueco: 0.25,
  hueco: { distancia: 10, variacion: 30, separacion: 3.5 },
}

// Borde rasgado (viewBox 1000 × 1000, se estira al tamaño del elemento)
const RASGADO = {
  lado: 1000,
  paso: 8,
  inercia: 0.72, // cuánto se parece cada punto al anterior
  amplitud: 0.9,
  base: 0.45, // fracción de la profundidad que entra siempre
  ruido: 0.35,
  probabilidadPico: 0.025,
  pico: 0.45,
  cerdas: { cantidad: 26, largoMin: 40, largoVariacion: 160, grosor: 2.5, alcance: 0.5, origen: 0.35 },
}

// Generador pseudoaleatorio con semilla (mulberry32)
export function aleatorio(semilla) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const aUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const rect = (x, y, ancho, alto) => `M${x} ${y}h${ancho}v${alto}h${-ancho}z`

// Trazo horizontal de pincel seco: franjas de cerdas con extremos irregulares.
export function trazoPincel(semilla) {
  const r = aleatorio(semilla)
  const { ancho, alto, franjas, margenVertical, solape, irregularidadExtremo, recorteFranjaBorde, hueco } = TRAZO
  const altoUtil = alto - margenVertical * 2
  const altoFranja = altoUtil / franjas + solape
  let d = ''
  for (let i = 0; i < franjas; i++) {
    const y = margenVertical + (i / franjas) * altoUtil + (r() - 0.5) * 2
    const recorte = i === 0 || i === franjas - 1 ? recorteFranjaBorde : 0
    const x0 = 2 + r() * irregularidadExtremo + recorte
    const x1 = ancho - 2 - r() * irregularidadExtremo - recorte
    if (r() < TRAZO.probabilidadHueco) {
      // hueco de pincel seco cerca del extremo derecho
      const corte = x1 - hueco.distancia - r() * hueco.variacion
      d += rect(x0, y, corte - x0 - hueco.separacion, altoFranja)
      d += rect(corte + hueco.separacion, y, x1 - corte - hueco.separacion, altoFranja)
    } else {
      d += rect(x0, y, x1 - x0, altoFranja)
    }
  }
  return aUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`,
  )
}

// Rectángulo con bordes superior e inferior rasgados, para enmarcar imágenes.
export function bordeRasgado(semilla, { arriba = true, abajo = true, profundidad = 60 } = {}) {
  const r = aleatorio(semilla)
  const L = RASGADO.lado
  const borde = (base, signo) => {
    const puntos = []
    let ruido = 0
    for (let x = 0; x <= L; x += RASGADO.paso) {
      ruido = ruido * RASGADO.inercia + (r() - 0.5) * RASGADO.amplitud
      const pico = r() < RASGADO.probabilidadPico ? r() * profundidad * RASGADO.pico : 0
      const entrada = profundidad * RASGADO.base + ruido * profundidad * RASGADO.ruido + pico
      puntos.push([x, base + signo * entrada])
    }
    return puntos
  }
  const superior = arriba
    ? borde(0, 1)
    : [
        [0, 0],
        [L, 0],
      ]
  const inferior = abajo
    ? borde(L, -1).reverse()
    : [
        [L, L],
        [0, L],
      ]
  const unir = (puntos) => puntos.map((p) => p.join(' ')).join('L')
  let d = `M${unir(superior)}L${unir(inferior)}Z`

  // cerdas sueltas que sobresalen del borde
  const { cerdas } = RASGADO
  const anadirCerdas = (base, signo) => {
    for (let i = 0; i < cerdas.cantidad; i++) {
      const x = r() * L
      const largo = cerdas.largoMin + r() * cerdas.largoVariacion
      const y = base + signo * (r() * profundidad * cerdas.alcance)
      d += rect(x, y, largo, signo * -cerdas.grosor)
    }
  }
  if (arriba) anadirCerdas(profundidad * cerdas.origen, -1)
  if (abajo) anadirCerdas(L - profundidad * cerdas.origen, 1)
  return aUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${L}" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`,
  )
}
