import type { Config } from 'stylelint'

export default {
  extends: [
    '@stylistic/stylelint-config',
    'stylelint-config-standard',
    'stylelint-config-html/astro',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'layer',
          'tailwind',
          'theme',
          'utility',
          'variant',
          'custom-variant',
          'source',
        ],
      },
    ],
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
    'number-max-precision': [4, { ignoreProperties: 'letter-spacing' }],
    'property-no-unknown': [true, { ignoreProperties: ['/^mso-/'] }],
    'import-notation': 'string',
    'media-feature-range-notation': null,
    'nesting-selector-no-missing-scoping-root': null,
    'no-invalid-position-declaration': null,
  },
  overrides: [
    {
      files: ['**/*.astro'],
      rules: {
        'custom-property-empty-line-before': null,
      },
    },
  ],
} satisfies Config
