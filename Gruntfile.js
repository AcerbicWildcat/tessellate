module.exports = function(grunt) {
  grunt.initConfig({
    // pkg: grunt.file.readJSON("package.json"),
    watch: {
      /*grunt: {
        files: ["Gruntfile.js", "package.json"],
        tasks: "default"
      },*/
      javascript: {
        files: [/*"Gruntfile.js",*/ "src/client/**/*.js", "src/server/*.js", "specs/**/*Spec.js"],
        tasks: "test"
      }
    },
    jasmine: {
      src: "src/client/js/*.js",
      options: {
        specs: "specs/client/*Spec.js"
      }
    },
    mochacli: {
      options: {
        reporter: "nyan",
        ui: "tdd"
      },
      all: ["specs/server/*Spec.js"]
    },
    jshint: {
      all: [
        "Gruntfile.js",
        "src/**/*.js",
        "spec/**/*.js"
      ]
    },
    // shell: {
    //   options: {
    //     stderr: false
    //   },
    //   target: {
    //     command: 'mkdir .grunt'
    //   }
    // },
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
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-jsdoc");


  grunt.registerTask("test", [/*"shell", */"jshint", "mochacli", "jasmine"]);
  grunt.registerTask("default", ["test"]);
  grunt.registerTask("document", ["jsdoc"]);
  grunt.registerTask("build", []);
};