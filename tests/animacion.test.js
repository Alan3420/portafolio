import { describe, expect, it } from 'vitest'
import { FPS_DIBUJO } from '../src/config'
import { pasos } from '../src/models/animacion'

describe('pasos', () => {
  it('convierte una duración en fotogramas a la cadencia configurada', () => {
    expect(pasos(1)).toBe(`steps(${FPS_DIBUJO})`)
    expect(pasos(0.5, 30)).toBe('steps(15)')
  })

  it('nunca devuelve menos de un paso', () => {
    expect(pasos(0)).toBe('steps(1)')
  })
})
