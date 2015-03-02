/* Grunt task aliases */

module.exports = function(grunt) {

  grunt.registerTask(
    'default',
    [
      'jshint',
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
      'browserify',
      'uglify:bundle',
      'qunit'
    ]
  );

};
