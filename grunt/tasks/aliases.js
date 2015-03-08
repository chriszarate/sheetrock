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
      'jscs',
      'uglify:app',
      'cssmin'
    ]
  );

  grunt.registerTask(
    'test',
    [
      'jshint',
      'jscs',
      'browserify',
      'uglify:bundle',
      'qunit'
    ]
  );

};
