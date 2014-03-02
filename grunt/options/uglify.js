/* grunt-contrib-uglify */

module.exports = {
  app: {
    options: {
      banner:
        '/*!\n' +
        ' * <%= pkg.title %> v<%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * License: <%= pkg.licenses[0].type %>\n' +
        ' */',
      sourceMap: 'src/jquery.sheetrock.min.map',
      sourceMappingURL: './jquery.sheetrock.min.map',
      sourceMapPrefix: 1
    },
    files: {
      'src/jquery.sheetrock.min.js': [
        'src/jquery.sheetrock.js'
      ]
    }
  }
};
