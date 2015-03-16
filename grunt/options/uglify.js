/* grunt-contrib-uglify */

'use strict';

module.exports = {
  app: {
    options: {
      preserveComments: 'some',
      sourceMap: true
    },
    files: {
      'dist/jquery.sheetrock.min.js': [
        'src/jquery.sheetrock.js'
      ]
    }
  },
  bundle: {
    files: {
      'build/jquery.sheetrock.bundle.min.js': [
        'build/jquery.sheetrock.bundle.js'
      ]
    }
  }
};
