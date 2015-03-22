/* grunt-contrib-uglify */

'use strict';

module.exports = {
  app: {
    options: {
      preserveComments: 'some',
      sourceMap: true
    },
    files: {
      'dist/sheetrock.min.js': [
        'src/sheetrock.js'
      ]
    }
  }
};
