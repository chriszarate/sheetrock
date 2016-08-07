/* eslint-disable */

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (!/node_modules/.test(file) && !/requirejs\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
  deps: tests,
  callback: window.__karma__.start
});
