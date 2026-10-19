import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['public/admin/vendor/**', '.output/**', 'coverage/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 4, multiline: 1 }],
    '@typescript-eslint/no-explicit-any': 'error'
  }
})
