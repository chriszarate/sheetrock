/* grunt-string-replace */

// Fix Uglify's inability to drop paths from source map output.
module.exports = {
  fix: {
    files: {
      'src/jquery.sheetrock.min.map': 'src/jquery.sheetrock.min.map'
    },
    options: {
      replacements: [{
        pattern: '"file":"src/jquery.sheetrock.min.js"',
        replacement: '"file":"jquery.sheetrock.min.js"'
      }]
    }
  }
};
