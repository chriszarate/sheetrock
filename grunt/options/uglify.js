/* grunt-contrib-uglify */

module.exports = {
  app: {
    options: {
      preserveComments: 'some',
      sourceMap: 'dist/jquery.sheetrock.min.map'
    },
    files: {
      'dist/jquery.sheetrock.min.js': [
        'src/jquery.sheetrock.js'
      ]
    }
  }
};
