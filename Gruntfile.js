module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var bannerTemplate =
    '/*!\n' +
    ' * <%= pkg.title %> v<%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * License: <%= pkg.licenses[0].type %>\n' +
    ' */';

  grunt.initConfig({

    pkg: grunt.file.readJSON('sheetrock.jquery.json'),

    jshint: {
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
    },

    uglify: {
      app: {
        options: {
          banner: bannerTemplate,
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
    },

    // Fix Uglify's inability to drop paths from source map output.
    "string-replace": {
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
    },

    cssmin: {
      add_banner: {
        options: {
          banner: bannerTemplate
        },
        files: {
          'src/sheetrock.min.css': [
            'css/sheetrock.css',
            'css/bootstrap.css',
            'css/prism-custom.css'
          ]
        }
      }
    },

    bumpup: [
      'bower.json',
      'package.json',
      'sheetrock.jquery.json'
    ]

  });

  // Register tasks.
  grunt.registerTask('default', ['jshint', 'uglify', 'string-replace']);
  grunt.registerTask('examples', ['jshint', 'uglify', 'string-replace', 'cssmin']);

};
