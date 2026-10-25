// Arquitectura de Game Rank según su README: qué corre dónde y cómo se conecta.
// Las coordenadas están en unidades del viewBox de cada disposición.

export const nodos = [
  { id: 'nav', titulo: 'Navegador', tec: 'Vue 3, Vite, PrimeVue', host: 'Cloudflare Pages' },
  { id: 'api', titulo: 'API REST', tec: 'FastAPI, JWT, SlowAPI', host: 'Google Cloud Run' },
  { id: 'db', titulo: 'Base de datos', tec: 'MySQL, migraciones con Alembic', host: 'Aiven' },
  { id: 'rawg', titulo: 'RAWG', tec: 'API externa de videojuegos', host: 'Cliente con caché' },
  { id: 'ci', titulo: 'GitHub Actions', tec: '48 tests unitarios y 28 de contrato', host: 'En cada push' },
]

export const disposiciones = {
  ancha: {
    ancho: 1000,
    alto: 470,
    cajas: {
      nav: [20, 190, 230, 116],
      api: [385, 190, 230, 116],
      db: [750, 70, 230, 116],
      rawg: [750, 310, 230, 116],
      ci: [385, 10, 230, 104],
    },
    tubos: [
      { id: 'nav-api', d: 'M250 248 L385 248', etiqueta: 'HTTPS + JWT', posEtiqueta: [318, 234] },
      { id: 'api-db', d: 'M615 225 C690 225 680 128 750 128', etiqueta: 'SQLAlchemy', posEtiqueta: [686, 166] },
      { id: 'api-rawg', d: 'M615 272 C690 272 680 368 750 368', etiqueta: 'HTTP', posEtiqueta: [705, 340] },
      { id: 'ci-api', d: 'M500 114 L500 190', etiqueta: 'tests', posEtiqueta: [532, 158] },
    ],
  },
  estrecha: {
    ancho: 400,
    alto: 1000,
    cajas: {
      nav: [80, 10, 240, 120],
      api: [80, 250, 240, 130],
      db: [5, 520, 185, 150],
      rawg: [210, 520, 185, 150],
      ci: [80, 820, 240, 130],
    },
    tubos: [
      { id: 'nav-api', d: 'M200 130 L200 250', etiqueta: 'HTTPS + JWT', posEtiqueta: [270, 196] },
      { id: 'api-db', d: 'M150 380 C150 450 97 450 97 520', etiqueta: '', posEtiqueta: null },
      { id: 'api-rawg', d: 'M250 380 C250 450 303 450 303 520', etiqueta: '', posEtiqueta: null },
      { id: 'ci-api', d: 'M200 820 L200 380', etiqueta: 'tests', posEtiqueta: [235, 720] },
    ],
  },
}

// Recorrido de una petición: va y vuelve por cada tubo (1 = ida, -1 = vuelta)
export const recorrido = [
  { tubo: 'nav-api', sentido: 1 },
  { tubo: 'api-db', sentido: 1 },
  { tubo: 'api-db', sentido: -1 },
  { tubo: 'api-rawg', sentido: 1 },
  { tubo: 'api-rawg', sentido: -1 },
  { tubo: 'nav-api', sentido: -1 },
  { tubo: 'ci-api', sentido: 1 },
]

// Caja de un nodo en porcentajes del contenedor, para posicionarlo con CSS
export function cajaEnPorcentaje(disposicion, id) {
  const [x, y, w, h] = disposicion.cajas[id]
  const { ancho, alto } = disposicion
  return {
    left: `${(x / ancho) * 100}%`,
    top: `${(y / alto) * 100}%`,
    width: `${(w / ancho) * 100}%`,
    height: `${(h / alto) * 100}%`,
  }
}

// Dónde está el pulso en el instante `t` (s): tramo activo y fracción recorrida
// sobre el trazado (0 = inicio del path, 1 = final). Devuelve null en la pausa.
export function estadoPulso(t, { segundosPorTramo, pausaFinal }, pasos = recorrido) {
  const ciclo = pasos.length * segundosPorTramo + pausaFinal
  const local = ((t % ciclo) + ciclo) % ciclo
  const indice = Math.floor(local / segundosPorTramo)
  if (indice >= pasos.length) return null
  const { tubo, sentido } = pasos[indice]
  const avance = (local - indice * segundosPorTramo) / segundosPorTramo
  return { tubo, fraccion: sentido > 0 ? avance : 1 - avance }
}
