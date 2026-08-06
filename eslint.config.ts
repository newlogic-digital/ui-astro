import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import astro from 'eslint-plugin-astro'

export default defineConfig([
  {
    ignores: ['**/*.d.ts', '**/dist'],
  },
  {
    plugins: { js },
    extends: [
      'js/recommended',
      tseslint.configs.recommended,
      stylistic.configs.customize({ jsx: false }),
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  ...astro.configs.recommended,
])
