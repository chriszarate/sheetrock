/* Grunt task aliases */

'use strict';

module.exports = function (grunt) {

  grunt.registerTask(
    'default',
    [
      'test',
      'uglify:app'
    ]
  );

  grunt.registerTask(
    'examples',
    [
      'jshint',
      'uglify:app',
      'cssmin'
    ]
  );

  grunt.registerTask(
    'test',
    [
      'jshint',
      'browserify',
      'uglify:bundle',
      'qunit'
    ]
  );

};
