/* Read package.json */

'use strict';

module.exports = function (grunt) {
  return grunt.file.readJSON('package.json');
};
