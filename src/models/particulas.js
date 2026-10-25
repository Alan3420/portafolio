// Física de las chispas, sin dibujo: velocidades en px/s y vida en segundos,
// para que el resultado no dependa de la cadencia a la que se pinte.

const entre = ([min, max], azar) => min + azar() * (max - min)

export function crearParticula(ancho, alto, cfg, { inicial = false, azar = Math.random } = {}) {
  const fria = azar() < cfg.probabilidadFria
  const vida = entre(cfg.vida, azar)
  const [calida, clara, frio] = cfg.colores
  return {
    x: azar() * ancho,
    y: inicial ? azar() * alto : alto + 10,
    vx: (azar() - 0.5) * cfg.velocidadX,
    vy: -entre(cfg.velocidadY, azar),
    edad: inicial ? azar() * vida : 0,
    vida,
    tamano: entre(cfg.tamano, azar),
    color: fria ? frio : azar() < cfg.probabilidadClara ? clara : calida,
    destello: azar() < cfg.probabilidadDestello,
  }
}

// Avanza una partícula `dt` segundos. Devuelve false si ya debe reemplazarse.
export function avanzarParticula(p, dt, cfg, azar = Math.random) {
  p.vx += (azar() - 0.5) * cfg.viento * dt
  p.vx *= 1 - cfg.rozamiento * dt
  p.x += p.vx * dt
  p.y += p.vy * dt
  p.edad += dt
  return p.edad <= p.vida && p.y >= -20
}

// 1 al nacer, 0 al morir
export const energia = (p) => Math.max(0, 1 - p.edad / p.vida)
