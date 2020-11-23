// https://github.com/typescript-eslint/typescript-eslint/issues/109

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:sonarjs/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
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
    'react-native/style-sheet-object-names': ['DynamicStyleSheet'],
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sonarjs', 'react', 'react-native'],
  rules: {
    'react-native/sort-styles': 0,
    'react/prop-types': 0,
    'no-shadow': 2,
  },
};
