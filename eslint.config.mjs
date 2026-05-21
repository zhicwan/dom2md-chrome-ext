// @ts-check
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint flat config — modeled after microsoft/fluentui core rules.
 * Stripped of React/monorepo-specific plugins; retains the same level
 * of strictness for a vanilla TypeScript project.
 *
 * @see https://github.com/microsoft/fluentui/blob/master/packages/eslint-plugin/src/configs/core.js
 */
export default tseslint.config(
  // --- Global ignores ---
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', 'icons/**', '*.js', '*.mjs'],
  },

  // --- Base recommended rules ---
  ...tseslint.configs.recommendedTypeChecked,

  // --- Prettier compat (disables formatting rules) ---
  prettierConfig,

  // --- Core rules (Fluent UI parity) ---
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Fluent UI "coreRules" ──
      curly: ['error', 'all'],
      'dot-notation': 'error',
      eqeqeq: ['error', 'always'],
      'guard-for-in': 'error',
      'no-alert': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-new-wrappers': 'error',
      'no-shadow': 'off', // superseded by TS rule
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      radix: ['error', 'always'],

      // ── Fluent UI "disabledRules" (intentionally relaxed) ──
      'no-case-declarations': 'off',
      'no-cond-assign': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-prototype-builtins': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-expressions': 'off',
      'no-use-before-define': 'off',
      'object-shorthand': 'warn',
      'prefer-destructuring': 'off',
      'prefer-template': 'off',
      'arrow-body-style': 'off',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'default-case': 'off',

      // ── TypeScript-specific (Fluent UI parity) ──
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'property',
          format: null, // allow any format for object properties
        },
      ],

      // ── Disable base rules superseded by TS equivalents ──
      camelcase: 'off',
      'no-empty-function': 'off',
      'no-unused-vars': 'off',
    },
  },
);
