/* grunt-contrib-cssmin */

module.exports = {
  add_banner: {
    options: {
      banner:
        '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * License: <%= pkg.license %>\n' +
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
