// Recorte tipo "cover" de una imagen dentro de un rectángulo, en coordenadas uv.
// `margen` < 1 amplía la imagen para que el paralaje no deje ver el borde.
// `anclaY` decide qué franja vertical se conserva (0 = arriba, 1 = abajo).
export function encuadreCover(aspectoRect, aspectoImagen, { margen = 1, anclaY = 0.5 } = {}) {
  let ancho = 1
  let alto = 1
  if (aspectoRect > aspectoImagen) alto = aspectoImagen / aspectoRect
  else ancho = aspectoRect / aspectoImagen
  ancho *= margen
  alto *= margen
  return { x: (1 - ancho) / 2, y: (1 - alto) * anclaY, ancho, alto }
}
