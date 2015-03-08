/* grunt-contrib-jshint */

'use strict';

module.exports = {
  options: {
    jshintrc: true
  },
  app: {
    files: {
      src: [
        'src/**/*.js',
        'grunt/**/*.js'
      ]
    }
  }
};
