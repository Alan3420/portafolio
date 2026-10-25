import { createApp } from 'vue'

// Fuentes servidas desde el propio sitio (sin peticiones a Google): solo el subconjunto latino
import '@fontsource/grenze/latin-500.css'
import '@fontsource/grenze/latin-700.css'
import '@fontsource/grenze/latin-800.css'
import '@fontsource/grenze/latin-900.css'
import '@fontsource/instrument-sans/latin-400.css'
import '@fontsource/instrument-sans/latin-500.css'
import '@fontsource/instrument-sans/latin-600.css'
import '@fontsource/permanent-marker/latin-400.css'

import './views/estilos/base.css'
import App from './views/App.vue'

createApp(App).mount('#app')
