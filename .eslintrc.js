const { off } = require('process');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  ignorePatterns: ['node_modules/*', '.next/*'],
  env: {
    browser: true,
    node: true,
  },
  plugins: ['simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Include .prettierrc.js rules
    'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-string-refs': 'warn',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off', // TODO: Comment this rule and block the use of @ts-ignore
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',

    '@typescript-eslint/no-var-requires': 'warn', // TODO: Comment this rule and make the fixes needed
    'no-useless-escape': 'warn', // TODO: Comment this rule and make the fixes needed
    '@typescript-eslint/ban-types': 'warn', // TODO: Comment this rule and make the fixes needed
    'react/no-unescaped-entities': 'warn', // TODO: Comment this rule and make the fixes needed
    'jsx-a11y/no-onchange': 'warn', // TODO: Comment this rule and make the fixes needed
    'react/no-danger-with-children': 'warn', // TODO: Comment this rule and make the fixes needed
    'no-prototype-builtins': 'warn', // TODO: Comment this rule and make the fixes needed

    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    '@typescript-eslint/consistent-type-assertions': [
      'warn',
      {
        assertionStyle: 'never',
      },
    ],

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
