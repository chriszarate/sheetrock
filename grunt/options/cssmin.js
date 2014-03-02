/* grunt-contrib-cssmin */

module.exports = {
  add_banner: {
    options: {
      banner:
        '/*!\n' +
        ' * <%= pkg.title %> v<%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * License: <%= pkg.licenses[0].type %>\n' +
        ' */'
    },
    files: {
      'src/sheetrock.min.css': [
        'css/sheetrock.css',
        'css/bootstrap.css',
        'css/prism-custom.css'
      ]
    }
  }
};
