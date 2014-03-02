/* Grunt task aliases */

module.exports = function(grunt) {

  grunt.registerTask(
    'default',
    [
      'jshint',
      'uglify',
      'string-replace'
    ]
  );

  grunt.registerTask(
    'examples',
    [
      'jshint',
      'uglify',
      'string-replace',
      'cssmin'
    ]
  );

};
