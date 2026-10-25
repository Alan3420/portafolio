import { describe, expect, it } from 'vitest'
import { aleatorio, bordeRasgado, trazoPincel } from '../src/models/pincel'

const svgDe = (url) => decodeURIComponent(url.slice('url("data:image/svg+xml,'.length, -2))

describe('aleatorio', () => {
  it('repite la misma secuencia con la misma semilla', () => {
    const a = aleatorio(42)
    const b = aleatorio(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('devuelve valores en [0, 1)', () => {
    const r = aleatorio(7)
    for (let i = 0; i < 1000; i++) {
      const v = r()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('trazoPincel', () => {
  it('genera siempre la misma máscara para la misma semilla', () => {
    expect(trazoPincel(21)).toBe(trazoPincel(21))
    expect(trazoPincel(21)).not.toBe(trazoPincel(34))
  })

  it('produce un SVG válido como url de CSS', () => {
    const url = trazoPincel(7)
    expect(url.startsWith('url("data:image/svg+xml,')).toBe(true)
    const svg = svgDe(url)
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 400 100"/)
    expect(svg).not.toContain('NaN')
  })
})

describe('bordeRasgado', () => {
  it('es determinista y no contiene valores inválidos', () => {
    const url = bordeRasgado(17, { profundidad: 70 })
    expect(url).toBe(bordeRasgado(17, { profundidad: 70 }))
    expect(svgDe(url)).not.toContain('NaN')
  })

  it('respeta los bordes rectos cuando se desactivan', () => {
    const svg = svgDe(bordeRasgado(3, { arriba: false, abajo: false }))
    expect(svg).toContain('M0 0L1000 0L1000 1000L0 1000Z')
  })
})
