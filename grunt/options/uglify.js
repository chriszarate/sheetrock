/* grunt-contrib-uglify */

module.exports = {
  app: {
    options: {
      preserveComments: 'some',
      sourceMap: 'src/jquery.sheetrock.min.map'
    },
    files: {
      'src/jquery.sheetrock.min.js': [
        'src/jquery.sheetrock.js'
      ]
    }
  }
};
