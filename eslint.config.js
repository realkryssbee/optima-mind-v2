import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

/** Flat config ESLint — tableau plat (aucune API dépréciée). */
export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.vercel/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '.lhci/**',
      'public/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.astro'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
    },
  },
];
