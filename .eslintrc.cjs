import prettierConfig from './.prettierrc.cjs';

module.exports = {
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    "'prettier/prettier'": ['error', prettierConfig],
  },
};
