/* Grunt task aliases */

module.exports = function(grunt) {

  grunt.registerTask(
    'default',
    [
      'jshint',
      'uglify'
    ]
  );

  grunt.registerTask(
    'examples',
    [
      'jshint',
      'uglify',
      'cssmin'
    ]
  );

  grunt.registerTask(
    'test',
    [
      'uglify',
      'qunit'
    ]
  );

};
