import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },

  pluginJs.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ['webpack.*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
