module.exports = function(grunt) {
  grunt.initConfig({
    /**
     * watch javascript files in src/ and specs/ for changes. Run grunt tast "test" on changes.
     * @type {Object}
     */
    watch: {
      javascript: {
        files: ["src/client/**/*.js", "src/server/*.js", "specs/**/*Spec.js"],
        tasks: "test"
      }
    },
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
        "src/**/*.js",
        "spec/**/*.js"
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
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-jsdoc");

  grunt.registerTask("test", ["jshint", "mochacli", "jasmine"]);
  grunt.registerTask("default", ["test"]);
  grunt.registerTask("document", ["jsdoc"]);
  grunt.registerTask("build", []);
  grunt.registerTask("server", ["mochacli", "nodemon", "watch" ]);

};
