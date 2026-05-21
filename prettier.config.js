// @ts-check

/**
 * Prettier config — matches microsoft/fluentui settings.
 * @see https://github.com/microsoft/fluentui/blob/master/prettier.config.js
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  overrides: [
    {
      files: ['*.html', '*.htm'],
      options: {
        trailingComma: 'es5',
      },
    },
  ],
};
