import { describe, expect, it } from 'vitest'
import { pulso } from '../src/config'
import { cajaEnPorcentaje, disposiciones, estadoPulso, nodos, recorrido } from '../src/models/arquitectura'

const idsNodos = nodos.map((n) => n.id)

describe('disposiciones del diagrama', () => {
  for (const [nombre, d] of Object.entries(disposiciones)) {
    it(`${nombre}: todos los nodos tienen caja dentro del lienzo`, () => {
      expect(Object.keys(d.cajas).sort()).toEqual([...idsNodos].sort())
      for (const [x, y, w, h] of Object.values(d.cajas)) {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(x + w).toBeLessThanOrEqual(d.ancho)
        expect(y + h).toBeLessThanOrEqual(d.alto)
      }
    })

    it(`${nombre}: los tubos unen nodos existentes`, () => {
      for (const tubo of d.tubos) {
        const [origen, destino] = tubo.id.split('-')
        expect(idsNodos).toContain(origen)
        expect(idsNodos).toContain(destino)
        if (tubo.etiqueta) expect(tubo.posEtiqueta).toHaveLength(2)
      }
    })
  }

  it('el recorrido solo usa tubos presentes en ambas disposiciones', () => {
    for (const d of Object.values(disposiciones)) {
      const tubos = d.tubos.map((t) => t.id)
      for (const paso of recorrido) expect(tubos).toContain(paso.tubo)
    }
  })
})

describe('cajaEnPorcentaje', () => {
  it('convierte coordenadas del viewBox a porcentajes', () => {
    const d = { ancho: 1000, alto: 500, cajas: { a: [100, 50, 200, 100] } }
    expect(cajaEnPorcentaje(d, 'a')).toEqual({ left: '10%', top: '10%', width: '20%', height: '20%' })
  })
})

describe('estadoPulso', () => {
  const ciclo = recorrido.length * pulso.segundosPorTramo + pulso.pausaFinal

  it('empieza en el primer tramo, al inicio del trazado', () => {
    expect(estadoPulso(0, pulso)).toEqual({ tubo: recorrido[0].tubo, fraccion: 0 })
  })

  it('recorre los tramos de vuelta en sentido inverso', () => {
    const indiceVuelta = recorrido.findIndex((p) => p.sentido < 0)
    const t = indiceVuelta * pulso.segundosPorTramo + pulso.segundosPorTramo * 0.25
    const estado = estadoPulso(t, pulso)
    expect(estado.tubo).toBe(recorrido[indiceVuelta].tubo)
    expect(estado.fraccion).toBeCloseTo(0.75)
  })

  it('se oculta durante la pausa final y se repite cada ciclo', () => {
    expect(estadoPulso(ciclo - pulso.pausaFinal / 2, pulso)).toBeNull()
    expect(estadoPulso(ciclo, pulso)).toEqual(estadoPulso(0, pulso))
  })
})
