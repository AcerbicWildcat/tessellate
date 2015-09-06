module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /**
     * Run 'grunt bower:install'
     */
    bower: {
      install: {
        options: {
          targetDir: './src/client/bower_components'
        }
      }
    },
    /**
     * watch javascript files in src/ and specs/ for changes. Run grunt tast "test" on changes.
     * @type {Object}
     */
    watch: {
      javascript: {
        files: ["src/client/**/*.js", "src/server/*.js", "specs/**/*Spec.js", "Gruntfile.js"],
        tasks: ['jshint', 'concat', 'copy']
      },
      html: {
        files: ["src/client/**/*.html", "src/server/*.html"],
        tasks: ['front']
      },
      sass: {
        files: 'src/client/sass/{,*/}*.{scss,sass}',
        tasks: ['sass:dist'],
      }

    },
    /**
     * nodemon server runner
     * @type {Object}
     */
    nodemon: {
      dev: {
        script: 'src/server/server.js'
      }
    },
    /**
     * jasmine spec runner task for client side testing
     * @type {Object}
     */
    jasmine: {
      src: "src/client/js/*.js",
      options: {
        specs: "specs/client/*Spec.js"
      }
    },
    /**
     * mochacli tool for server side testing
     * @type {Object}
     */
    mochacli: {
      options: {
        reporter: "nyan",
        ui: "tdd"
      },
      all: ["specs/server/*Spec.js"]
    },
    /**
     * javascript syntax checking task
     * @type {Object}
     */
    jshint: {
      all: [
        "Gruntfile.js",
        "src/client/js/*.js"
      ]
    },
    /**
     * task for documentation generation using jsdoc. Will create documentation for Gruntfile, src/ and specs/
     * @type {Object}
     */
    jsdoc: {
      dist: {
        src: ["Gruntfile.js", "src/client/**/*.js", "src/server/*.js", "specs/**/*Spec.js"],
        options: {
          destination: 'doc'
        }
      }
    },
    /**
     * Task for concatenating javascript files into a .min file
     */
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        'src/client/bower_components/ng-file-upload/ng-file-upload-all.min.js',
        // 'src/client/bower_components/dropzone/dist/dropzone.min.js',
        'src/client/bower_components/jquery/dist/jquery.js', 
        'src/client/bower_components/bootstrap/dist/js/bootstrap.js', 
        'src/client/bower_components/magnific-popup/dist/jquery.magnific-popup.js',
        'src/client/js/tessellate.js'],
        dest: 'src/server/public/js/app.min.js'
      },
    },
    /**
     * Task for concatenating scss files into css
     */
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/client/sass/',
          src: ['**/*.scss'],
            dest: 'src/server/public/css/',
            ext: '.css'
        }]
      }
    },
    copy: {
      main: {
        files: [{ 
          expand: true,
          flatten: true, 
          filter: 'isFile',
          src: ['src/client/bower_components/bootstrap/fonts/**'],
          dest: 'src/server/public/fonts'
        }, {
          expand: true, 
          flatten: true,
          filter: 'isFile',
          src: ['src/client/bower_components/bootstrap/dist/css/**'],
          dest: 'src/server/public/css/'
        }, {
          expand: true, 
          flatten: true,
          filter: 'isFile',
          src: ['src/client/bower_components/dropzone/dist/*.css'],
          dest: 'src/server/public/css/'
        }, { 
          expand: true,
          flatten: true, 
          filter: 'isFile',
          src: ['src/client/*.html', 'src/client/templates/*.html'],
          dest: 'src/server/public/'
        }, { 
          expand: true,
          flatten: true, 
          filter: 'isFile',
          src: ['src/client/css/**'],
          dest: 'src/server/public/css'
        }, { 
          expand: true,
          flatten: true, 
          filter: 'isFile',
          src: ['src/client/assets/**'],
          dest: 'src/server/public/assets'
        }, {
          expand: true, 
          flatten: true,
          filter: 'isFile',
          src: ['src/client/js/main.js', 'src/client/js/authServices.js'],
          dest: 'src/server/public/js'
        }, {
          expand: true, 
          flatten: true,
          filter: 'isFile',
          src: ['src/client/bower_components/dropzone/dist/min/dropzone.min.js'],
          dest: 'src/server/public/js'
        }/*, { 
          expand: true,
          flatten: true, 
          filter: 'isFile',
          src: ['src/client/bower_components/ng-flow/dist/ng-flow-standalone.min.js'],
          dest: 'src/server/public/js'
        }*/],
      },
    },

  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask("test", ["jshint", "mochacli", "jasmine"]);
  grunt.registerTask("default", ["test"]);
  grunt.registerTask("document", ["jsdoc"]);
  grunt.registerTask("server", ["mochacli", "nodemon", "watch"]);
  grunt.registerTask("front", ['bower:install', 'sass', 'concat', 'copy', 'watch']);

  grunt.registerTask("build", ['bower:install', 'concat', 'copy']);

};
