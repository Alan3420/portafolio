// Shaders de la escena pintada. Las constantes con nombre son los ajustes finos
// del aspecto; los parámetros por capa llegan como uniforms desde config.js.

export const VERTICE = `#version 300 es
in vec2 aPos;
uniform vec4 uRect;
uniform vec2 uRes;
out vec2 vUv;
void main() {
  vec2 px = uRect.xy + aPos * uRect.zw;
  vec2 clip = px / uRes * 2.0 - 1.0;
  vUv = aPos;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`

export const FRAGMENTO = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 frag;
uniform sampler2D uColor;
uniform sampler2D uProf;
uniform vec4 uCrop;
uniform vec2 uTexel;
uniform vec2 uMouse;
uniform vec2 uLuz;
uniform vec2 uAspecto;
uniform float uTiempo;
uniform float uRevelado;
uniform float uParallax;
uniform float uRetrato;
uniform float uFarol;
uniform vec3 uColorFarol;
uniform vec3 uColorBorde;
uniform vec2 uCorte;

// paralaje
const float PROF_NEUTRA = 0.35;      // profundidad que no se mueve
const int PASOS_PARALAJE = 4;
// relieve y farol
const float RELIEVE = 16.0;          // exageración de la normal sacada de la profundidad
const float ALTURA_FAROL = 0.22;
const float ALCANCE_FAROL = 12.0;    // mayor = luz más concentrada
const float BANDAS_LUZ = 4.0;        // niveles de la luz "pintada"
const float MEZCLA_BANDAS = 0.5;
const float FUERZA_FAROL = 0.6;
// textura de pincelada
const float ESCALA_TRAZO = 9.0;
const float ESTIRADO_TRAZO = 9.0;
const vec2 DERIVA_TRAZO = vec2(0.18, 0.05);
const float BASE_TRAZO = 0.93;
const float FUERZA_TRAZO = 0.13;
// retrato
const vec3 TINTE_AMBIENTE = vec3(0.74, 0.86, 0.9);
const float MEZCLA_TINTE = 0.4;
const vec2 CENTRO_FIGURA = vec2(0.52, 0.34);
const vec2 FORMA_FUNDIDO = vec2(1.3, 1.0);
const vec2 RADIOS_FUNDIDO = vec2(0.42, 0.66);
const vec2 DIRECCION_CONTORNO = vec2(-0.75, -0.65);
const float FUERZA_CONTORNO = 0.9;
const float OSCURECER_HALO = 0.35;
// revelado
const float ANCHO_PINCELADA = 0.04;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * ruido(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = uCrop.xy + vUv * uCrop.zw;

  // paralaje: lo cercano (profundidad alta) se desplaza más que lo lejano
  vec2 desp = uMouse * uParallax;
  vec2 p = uv;
  for (int i = 0; i < PASOS_PARALAJE; i++) {
    p = uv - desp * (texture(uProf, p).r - PROF_NEUTRA);
  }
  vec3 col = texture(uColor, p).rgb;
  float d = texture(uProf, p).r;

  // normal aproximada a partir de la profundidad
  float dx = texture(uProf, p + vec2(uTexel.x, 0.0)).r - texture(uProf, p - vec2(uTexel.x, 0.0)).r;
  float dy = texture(uProf, p + vec2(0.0, uTexel.y)).r - texture(uProf, p - vec2(0.0, uTexel.y)).r;
  vec3 n = normalize(vec3(-dx * RELIEVE, -dy * RELIEVE, 1.0));

  // farol: luz cálida en el cursor, en bandas como luz pintada
  vec2 dl = (uLuz - vUv) * uAspecto;
  float caida = 1.0 / (1.0 + dot(dl, dl) * ALCANCE_FAROL);
  float luz = max(dot(n, normalize(vec3(dl, ALTURA_FAROL))), 0.0) * caida * (0.3 + d);
  float bandas = floor(luz * BANDAS_LUZ + fbm(vUv * 30.0 + uTiempo * 0.4) * 0.6) / BANDAS_LUZ;
  luz = mix(luz, bandas, MEZCLA_BANDAS);
  col += uColorFarol * luz * FUERZA_FAROL * uFarol;
  col *= mix(1.0, 0.8 + 0.3 * caida, uFarol);

  // pinceladas diagonales que derivan despacio, como un fondo pintado a mano
  vec2 q = mat2(0.82, -0.57, 0.57, 0.82) * (vUv * uAspecto * ESCALA_TRAZO);
  float trazo = fbm(vec2(q.x, q.y * ESTIRADO_TRAZO) + DERIVA_TRAZO * uTiempo);
  col *= BASE_TRAZO + FUERZA_TRAZO * trazo;

  float alfa = 1.0;
  if (uRetrato > 0.5) {
    // integra la ropa clara en la luz ambiente fría de la escena
    col = mix(col, col * TINTE_AMBIENTE, MEZCLA_TINTE);
    float bordeRuido = (fbm(vUv * 22.0 + uTiempo * 0.3) - 0.5) * 0.04;
    alfa = smoothstep(uCorte.x, uCorte.y, d + bordeRuido);
    // fundido elíptico centrado en la cabeza: sin bordes rectos en los lados
    float elipse = length((vUv - CENTRO_FIGURA) * FORMA_FUNDIDO);
    float fundido = 1.0 - smoothstep(RADIOS_FUNDIDO.x, RADIOS_FUNDIDO.y, elipse);
    fundido = clamp(fundido + (fbm(vUv * vec2(6.0, 30.0)) - 0.5) * 0.4 * (1.0 - fundido), 0.0, 1.0);
    alfa *= fundido;
    // luz de contorno fría desde atrás a la izquierda
    float contorno = pow(clamp(1.0 - n.z, 0.0, 1.0), 1.4) * max(dot(normalize(n.xy + 1e-5), normalize(DIRECCION_CONTORNO)), 0.0);
    col += uColorBorde * contorno * FUERZA_CONTORNO * smoothstep(uCorte.y, uCorte.y + 0.12, d);
    // oscurece el halo de la pared gris original
    col *= mix(OSCURECER_HALO, 1.0, smoothstep(uCorte.x + 0.02, uCorte.y + 0.06, d));
  }

  // revelado: pinceladas horizontales que avanzan de izquierda a derecha
  float umbral = vUv.x * 0.65 + fbm(vec2(vUv.x * 2.5, vUv.y * 16.0)) * 0.45;
  alfa *= smoothstep(umbral - ANCHO_PINCELADA, umbral, uRevelado * 1.12);

  frag = vec4(col * alfa, alfa);
}`
