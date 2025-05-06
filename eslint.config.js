import config from '@vue/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'

export default [
  {
    plugins: {
      vue: eslintPluginVue,
    },
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: {
          js: 'espree',
          ts: '@typescript-eslint/parser',
        },
      },
    },
    ...config,
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
