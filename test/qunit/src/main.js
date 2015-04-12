'use strict';

var exec = require('child_process').exec;
var glob = require('glob');

var phantomjs = 'node_modules/phantomjs/bin/phantomjs';
var options = ' --web-security=false';
var runScript = 'node_modules/phantomjs/lib/phantom/examples/run-qunit.js';
var exitCode = 0;

glob('test/qunit/*.html', function (error, files) {

  var fileCount = files.length;

  files.forEach(function (file) {
    exec(phantomjs + options + ' ' + runScript + ' ' + file, function (error, stdout, stderr) {
      fileCount = fileCount - 1;
      console.log(stdout, stderr);
      if (error || stderr) {
        exitCode = 1;
      }
      if (fileCount === 0) {
        process.exit(exitCode);
      }
    });
  });

});
