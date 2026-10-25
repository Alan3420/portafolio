// Contenido del portafolio. Fuentes: CV (octubre 2026), perfil de GitHub y README de cada repositorio.

export const persona = {
  nombre: 'Alan Novas Mateo',
  rol: 'Desarrollador full-stack junior',
  ubicacion: 'A Coruña, España',
  email: 'alan.n.m143@gmail.com',
  linkedin: 'https://www.linkedin.com/in/alan-novas-mateo-690853278',
  github: 'https://github.com/Alan3420',
  cv: '/cv/CV_Alan_Novas_Mateo.pdf',
  resumen:
    'Construyo APIs REST en Python con FastAPI y Flask, y las interfaces en Vue 3 que las consumen. Recién titulado en Desarrollo de Aplicaciones Web, con seis meses de prácticas en el CITIC. Busco mi primera oportunidad profesional.',
}

export const gameRank = {
  nombre: 'Game Rank',
  contexto: 'Proyecto de fin de ciclo, DAW 2026',
  descripcion:
    'Plataforma web para descubrir, valorar y organizar videojuegos. Los usuarios exploran el catálogo de RAWG, guardan favoritos, escriben comentarios, puntúan y gestionan su colección por estados. Incluye un panel de administración para gestionar usuarios y moderar comentarios.',
  demo: 'https://game-rank-2h1.pages.dev/',
  codigo: 'https://github.com/Alan3420/Game-Rank',
  puntos: [
    {
      titulo: 'Migración de Flask a FastAPI sin romper el frontend',
      texto: 'Tests de contrato que comparan las respuestas de las 35 rutas con las grabadas desde la versión Flask.',
    },
    {
      titulo: 'Seguridad básica de producción',
      texto:
        'Autenticación JWT, roles de administrador, límite de peticiones con SlowAPI y saneado con DOMPurify del HTML que llega de RAWG.',
    },
    {
      titulo: 'Arquitectura por capas',
      texto: 'Routers, servicios, repositorios y un cliente de RAWG con caché.',
    },
    {
      titulo: 'Tests en cada push',
      texto: '48 tests unitarios y 28 de contrato con pytest, ejecutados en GitHub Actions.',
    },
  ],
  stack: {
    Servidor: ['Python 3.13', 'FastAPI', 'SQLAlchemy', 'Alembic', 'PyJWT', 'SlowAPI'],
    Navegador: ['Vue 3', 'Vite', 'Vue Router', 'PrimeVue', 'Axios', 'DOMPurify'],
    Infraestructura: ['Google Cloud Run', 'Aiven MySQL', 'Cloudflare Pages', 'GitHub Actions', 'Docker Compose'],
  },
  capturas: [
    {
      archivo: 'gamerank-inicio',
      alt: 'Pantalla de inicio de Game Rank con el resumen de la colección y la sección Discover',
    },
    { archivo: 'gamerank-catalogo', alt: 'Catálogo de Game Rank con juegos en cuadrícula y filtros' },
    { archivo: 'gamerank-detalle', alt: 'Ficha de detalle de un juego en Game Rank' },
  ],
}

export const secundarios = [
  {
    nombre: 'Pokémon Sonimu',
    nota: 'en equipo',
    descripcion:
      'Aplicación web de batallas Pokémon por turnos. Los entrenadores se registran, eligen un Pokémon de la Pokédex y combaten contra un rival aleatorio.',
    puntos: [
      'Arquitectura por capas en Flask: rutas, servicios, repositorios y clientes.',
      'Cliente de PokeAPI con caché LRU de 100 entradas y caducidad por TTL.',
      'Motor de combate con efectividad de 18 tipos, precisión y orden por velocidad.',
    ],
    stack: ['Flask', 'SQLAlchemy', 'SQLite', 'Flask-WTF', 'pytest'],
    codigo: 'https://github.com/Alan3420/pokemon_sonimu',
  },
  {
    nombre: 'Generador de facturas PDF',
    nota: 'automatización',
    descripcion:
      'Convierte un proceso manual, hacer facturas una a una, en un solo comando. Pensado para autónomos y pymes.',
    puntos: [
      'Modo interactivo por terminal y modo por lotes desde Excel.',
      'Cálculo de IVA e IRPF con numeración correlativa persistente.',
      'Agrupa las líneas por cliente y genera un PDF por cada uno.',
    ],
    stack: ['Python', 'fpdf2', 'openpyxl'],
    codigo: 'https://github.com/Alan3420/generador-de-facturas-pdf',
  },
]

export const trayectoria = [
  {
    fecha: 'Ene – Jun 2026',
    titulo: 'Prácticas en desarrollo de software',
    lugar: 'CITIC, Centro de Investigación TIC',
    puntos: [
      'Mantenimiento y corrección de bugs en ADES, un sistema de gestión de reservas, durante su migración de PHP a Python.',
      'Definición y análisis de nuevas propuestas de proyecto con el equipo de desarrollo.',
      'Git con flujo de ramas y revisión de código del equipo.',
      'Planificación ágil de tareas y resolución de tickets de soporte de usuarios.',
    ],
  },
  {
    fecha: '2026',
    titulo: 'Técnico Superior en Desarrollo de Aplicaciones Web',
    lugar: 'IES Fernando Wirtz Suárez',
    puntos: ['Proyecto de fin de ciclo: Game Rank.'],
  },
]

export const stack = [
  { capa: 'Servidor', items: ['Python', 'FastAPI', 'Flask', 'SQLAlchemy', 'Alembic', 'Pydantic', 'JWT', 'Java'] },
  { capa: 'Navegador', items: ['Vue 3', 'JavaScript', 'Vite', 'PrimeVue', 'HTML', 'CSS'] },
  { capa: 'Datos', items: ['MySQL', 'SQLite', 'Diseño de bases de datos'] },
  {
    capa: 'Calidad y despliegue',
    items: ['pytest', 'GitHub Actions', 'Docker', 'Git', 'Google Cloud Run', 'Cloudflare Pages'],
  },
]

export const idiomas = [
  { idioma: 'Español', nivel: 'nativo' },
  { idioma: 'Inglés', nivel: 'B1' },
]

export const creditosImagenes = [
  {
    autor: 'Raphael Roth',
    titulo: 'Romanshorn At Dusk',
    fuente: 'https://commons.wikimedia.org/wiki/File:Romanshorn_At_Dusk_(Unsplash).jpg',
  },
  {
    autor: 'Jani Brumat',
    titulo: 'Stormy Night At The Dam',
    fuente: 'https://commons.wikimedia.org/wiki/File:Stormy_Night_At_The_Dam_(Unsplash).jpg',
  },
  {
    autor: 'Will Langenberg',
    titulo: 'Bridge Nightfall City Skyline',
    fuente: 'https://commons.wikimedia.org/wiki/File:Bridge_Nightfall_City_Skyline_(Unsplash).jpg',
  },
]
