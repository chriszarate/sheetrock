/* Grunt task aliases */

'use strict';

module.exports = function (grunt) {

  grunt.registerTask(
    'default',
    [
      'test',
      'uglify'
    ]
  );

  grunt.registerTask(
    'examples',
    [
      'jshint',
      'jscs',
      'uglify',
      'cssmin'
    ]
  );

  grunt.registerTask(
    'test',
    [
      'jshint',
      'jscs',
      'browserify',
      'qunit'
    ]
  );

};
