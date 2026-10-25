import { describe, expect, it } from 'vitest'
import { chispas as cfg } from '../src/config'
import { aleatorio } from '../src/models/pincel'
import { avanzarParticula, crearParticula, energia } from '../src/models/particulas'

const ANCHO = 1200
const ALTO = 800

describe('crearParticula', () => {
  it('nace bajo el borde inferior y sube', () => {
    const p = crearParticula(ANCHO, ALTO, cfg, { azar: aleatorio(1) })
    expect(p.y).toBeGreaterThan(ALTO)
    expect(p.vy).toBeLessThan(0)
    expect(p.edad).toBe(0)
  })

  it('respeta los rangos de la configuración', () => {
    const azar = aleatorio(2)
    for (let i = 0; i < 200; i++) {
      const p = crearParticula(ANCHO, ALTO, cfg, { inicial: true, azar })
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(ANCHO)
      expect(-p.vy).toBeGreaterThanOrEqual(cfg.velocidadY[0])
      expect(-p.vy).toBeLessThanOrEqual(cfg.velocidadY[1])
      expect(p.vida).toBeGreaterThanOrEqual(cfg.vida[0])
      expect(p.vida).toBeLessThanOrEqual(cfg.vida[1])
      expect(p.edad).toBeLessThanOrEqual(p.vida)
      expect(cfg.colores).toContain(p.color)
    }
  })
})

describe('avanzarParticula', () => {
  it('el recorrido no depende de la cadencia de dibujo', () => {
    const base = crearParticula(ANCHO, ALTO, cfg, { azar: aleatorio(3) })
    const sinViento = { ...cfg, viento: 0 }
    const a = { ...base }
    const b = { ...base }
    for (let i = 0; i < 30; i++) avanzarParticula(a, 1 / 30, sinViento, () => 0.5)
    for (let i = 0; i < 12; i++) avanzarParticula(b, 1 / 12, sinViento, () => 0.5)
    expect(a.edad).toBeCloseTo(1)
    expect(b.edad).toBeCloseTo(1)
    // la subida en un segundo debe ser casi la misma a 30 y a 12 fps
    expect(Math.abs(a.y - b.y)).toBeLessThan(1)
  })

  it('pide reemplazo al agotar su vida', () => {
    const p = crearParticula(ANCHO, ALTO, cfg, { azar: aleatorio(4) })
    p.vy = 0
    expect(avanzarParticula(p, p.vida + 0.01, cfg)).toBe(false)
  })

  it('pide reemplazo al salir por arriba', () => {
    const p = crearParticula(ANCHO, ALTO, cfg, { azar: aleatorio(5) })
    p.y = -10
    p.vy = -500
    expect(avanzarParticula(p, 0.1, cfg)).toBe(false)
  })
})

describe('energia', () => {
  it('va de 1 al nacer a 0 al morir', () => {
    expect(energia({ edad: 0, vida: 2 })).toBe(1)
    expect(energia({ edad: 1, vida: 2 })).toBe(0.5)
    expect(energia({ edad: 3, vida: 2 })).toBe(0)
  })
})
