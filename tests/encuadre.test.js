import { describe, expect, it } from 'vitest'
import { encuadreCover } from '../src/models/encuadre'

describe('encuadreCover', () => {
  it('no recorta si los aspectos coinciden', () => {
    expect(encuadreCover(1.5, 1.5)).toEqual({ x: 0, y: 0, ancho: 1, alto: 1 })
  })

  it('recorta arriba y abajo cuando el rectángulo es más ancho que la imagen', () => {
    const r = encuadreCover(2, 1)
    expect(r.ancho).toBe(1)
    expect(r.alto).toBe(0.5)
    expect(r.y).toBe(0.25)
  })

  it('recorta los lados cuando el rectángulo es más estrecho', () => {
    const r = encuadreCover(0.5, 1)
    expect(r.ancho).toBe(0.5)
    expect(r.x).toBe(0.25)
  })

  it('el ancla vertical decide qué franja se conserva', () => {
    expect(encuadreCover(2, 1, { anclaY: 0 }).y).toBe(0)
    expect(encuadreCover(2, 1, { anclaY: 1 }).y).toBe(0.5)
  })

  it('el margen amplía la imagen y la mantiene centrada', () => {
    const r = encuadreCover(1, 1, { margen: 0.9 })
    expect(r.ancho).toBeCloseTo(0.9)
    expect(r.x).toBeCloseTo(0.05)
  })
})
