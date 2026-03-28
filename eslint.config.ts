import antfu from '@antfu/eslint-config'
// @ts-ignore
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    ignores: ['.pnpm-store'],
    stylistic: true,
    isInEditor: false,
    formatters: {
      html: true,
      css: true,
      markdown: true,
    },
    pnpm: {
      yaml: false,
    },
    markdown: true,
    javascript: {
      overrides: {
        'unused-imports/no-unused-vars': ['error', {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: false,
          vars: 'all',
          varsIgnorePattern: '^_',
        }],
      },
    },
    typescript: {
      overrides: {
        'ts/no-non-null-assertion': 'error',
        'ts/explicit-function-return-type': 'error',
      },
    },
    vue: {
      overrides: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
          registeredComponentsOnly: false,
          ignores: ['apexchart'],
        }],
        'vue/max-attributes-per-line': ['error', {
          singleline: 1,
          multiline: { max: 1 },
        }],
        'vue/attributes-order': ['error', {
          alphabetical: true,
        }],
        'vue/singleline-html-element-content-newline': ['error', {
          ignoreWhenNoAttributes: false,
          ignores: ['pre', 'textarea'],
        }],
      },
    },
  },
  // Дополнительная настройка проекта
  ...(tailwindcssPlugin.configs['flat/recommended'] as any),
  {
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },
)
