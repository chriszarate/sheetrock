/* Read package.json */

module.exports = function(grunt) {
  return grunt.file.readJSON('package.json');
};
