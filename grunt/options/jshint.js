/* grunt-contrib-jshint */

module.exports = {
  options: {
    camelcase: true,
    curly: true,
    devel: true,
    eqeqeq: true,
    forin: true,
    immed: true,
    indent: 2,
    latedef: true,
    newcap: true,
    noarg: true,
    noempty: true,
    plusplus: true,
    quotmark: true,
    strict: false,
    trailing: true,
    undef: true,
    unused: true
  },
  app: {
    options: {
      browser: true
    },
    files: {
      src: ['src/jquery.sheetrock.js']
    }
  }
};
