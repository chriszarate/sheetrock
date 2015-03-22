/* grunt-browserify */

'use strict';

module.exports = {
  dist: {
    files: {
      'build/sheetrock.bundle.js': ['test/qunit/main.js']
    }
  }
};
