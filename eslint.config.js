import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Reglas básicas
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      
      // Reglas de estilo
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      
      // Reglas de buenas prácticas
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      
      // Reglas de promesas
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      
      // Reglas de seguridad
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      
      // Reglas de rendimiento
      'no-await-in-loop': 'warn',
      'no-loop-func': 'warn',
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },
  prettier,
]; 