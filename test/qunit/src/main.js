'use strict';

var glob = require('glob');
var qunit = require('node-qunit-phantomjs');

glob('test/qunit/*.html', function (error, files) {
  files.forEach(function (file) {
    qunit(file);
  });
});
