import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist/', 'raw/', 'node_modules/'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  // el formato lo decide Prettier: se desactivan las reglas de estilo que chocarían
  prettier,
  {
    files: ['**/*.{js,vue}'],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js', '*.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
]
