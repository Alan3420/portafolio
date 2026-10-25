import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { creditosImagenes, gameRank, persona, secundarios, stack, trayectoria } from '../src/models/perfil'

const esHttps = (url) => /^https:\/\/[^\s]+$/.test(url)

describe('contenido del perfil', () => {
  it('los enlaces externos son https', () => {
    const enlaces = [
      persona.linkedin,
      persona.github,
      gameRank.demo,
      gameRank.codigo,
      ...secundarios.map((p) => p.codigo),
      ...creditosImagenes.map((c) => c.fuente),
    ]
    for (const url of enlaces) expect(esHttps(url), url).toBe(true)
  })

  it('el correo tiene formato válido', () => {
    expect(persona.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('el CV enlazado existe en public/', () => {
    expect(existsSync(`public${persona.cv}`)).toBe(true)
  })

  it('las capturas de Game Rank existen en assets', () => {
    for (const c of gameRank.capturas) {
      expect(existsSync(`src/assets/img/${c.archivo}.webp`), c.archivo).toBe(true)
      expect(c.alt.length).toBeGreaterThan(10)
    }
  })

  it('no hay secciones vacías', () => {
    expect(gameRank.puntos.length).toBeGreaterThan(0)
    expect(secundarios.length).toBeGreaterThan(0)
    expect(trayectoria.length).toBeGreaterThan(0)
    for (const grupo of stack) expect(grupo.items.length).toBeGreaterThan(0)
  })
})
