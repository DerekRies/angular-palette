'use strict';

module.exports = function (grunt) {

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
      dest: 'dist'
    },
    clean: {
      files: [{
        dot: true,
        src: [
          '<%= dirs.dist %>/*',
          '!<%= dirs.dist %>/.git*'
        ]
      }]
    },
    concat: {},
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= dirs.dest >%/<%= pkg.name %>.min.js'
      }
    },


  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', [
    'clean',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);

};
