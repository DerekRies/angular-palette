'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %>  \n' +
        ' * <%= pkg.description %>\n' +
        ' * @version v <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */\n'
    },
    dirs: {
      dest: 'dist',
      tmp: 'tmp'
    },
    clean: {
      build: {
        src: ['<%= dirs.tmp %>/*', '<%= dirs.dest %>/*', '<%= dirs.dest %>/styles/*', '!<%= dirs.dest %>/.git*']
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dest: 'dist/',
          src: [
            '<%= pkg.name %>.js',
          ]
        }]
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          src: 'dist/<%= pkg.name %>.js',
          dest: ''
        }]
      }
    },
    html2js: {
      options: {

      },
      main: {
        src: 'palette.tpl.html',
        dest: 'tmp/templates.js'
      }
    },
    replace: {
      template: {
        src: ['tmp/templates.js'],
        dest: 'tmp/templates.js',
        replacements: [
          {
            from: '../palette',
            to: 'angular-palette/palette',
          }
        ]
      },
      dist: {
        src: ['dist/angular-palette.js'],
        dest: 'dist/angular-palette.js',
        replacements: [
          {
            from: '\'ngSanitize\']',
            to: '"ngSanitize", "templates-main"]'
          }
        ]
      }
    },
    concat: {
      options: {
        seperator: '\n'
      },
      dist: {
        src: ['angular-palette.js', 'tmp/templates.js'],
        dest: 'dist/angular-palette.js'
      },
      deps: {
        src: [
          'components/mousetrap/mousetrap.min.js',
          'components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
          'dist/angular-palette.min.js'
        ],
        dest: 'dist/angular-palette-deps.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'styles',
          cssDir: 'dist/styles'
        }
      }
    },
    cssmin: {
      dist: {
        expand: true,
        cwd: 'dist/styles',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/styles',
        ext: '.min.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: '<%= dirs.dest %>/<%= pkg.name %>.js',
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
    },


  });

  grunt.registerTask('build', [
    'clean:build',
    'compass:dist',
    'cssmin:dist',
    'html2js',
    'replace:template',
    'concat:dist',
    'replace:dist',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('deps', ['concat:deps']);

  grunt.registerTask('fullbuild', ['build', 'concat:deps']);
};
