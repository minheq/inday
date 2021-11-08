module.exports = {
  root: true,
  overrides: [
    {
      files: ['app/**/*.tsx', 'app/**/*.ts', 'index.web.tsx'],
      env: { browser: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:sonarjs/recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      parserOptions: {
        project: `./tsconfig.json`,
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'sonarjs', 'react', 'react-native'],
      rules: {
        'react-native/sort-styles': 0,
        'react-native/no-raw-text': 1,
        'react/prop-types': 0,
        'no-shadow': 2,
        '@typescript-eslint/ban-ts-comment': 1,
        'react/jsx-props-no-spreading': 2,
        'react/no-unescaped-entities': 2,
        'react/destructuring-assignment': 1,
        'react/jsx-fragments': [1, 'element'],
        'react/jsx-handler-names': 1,
      },
    },
    {
      files: ['server/**/*.ts', 'lib/**/*.ts', 'models/**/*.ts'],
      env: { node: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:sonarjs/recommended',
        'prettier',
      ],
      parserOptions: {
        project: `./tsconfig.json`,
      },
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'sonarjs'],
      rules: {
        'no-shadow': 2,
        '@typescript-eslint/ban-ts-comment': 1,
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/require-await': 0,
        '@typescript-eslint/no-floating-promises': 0,
        'sonarjs/no-duplicate-string': 0,
        'sonarjs/no-identical-functions': 0,
      },
    },
    {
      files: ['scripts/*.js', '*.js'],
      env: { node: true },
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 10,
        sourceType: 'script',
      },
      extends: ['eslint:recommended', 'plugin:sonarjs/recommended', 'prettier'],
      plugins: ['sonarjs'],
      rules: {
        'no-shadow': 2,
      },
    },
    {
      files: ['index.js'],
      env: { browser: true },
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 10,
        sourceType: 'module',
      },
      extends: ['eslint:recommended', 'plugin:sonarjs/recommended', 'prettier'],
      plugins: ['sonarjs'],
      rules: {
        'no-shadow': 2,
      },
    },
  ],
};
