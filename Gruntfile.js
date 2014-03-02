'use strict';

module.exports = function(grunt) {

  var bannerTemplate =
    '/*!\n' +
    ' * <%= pkg.title %> v<%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * License: <%= pkg.licenses[0].type %>\n' +
    ' */';

  require('load-grunt-tasks')(grunt);
};
