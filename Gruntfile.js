module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
/*      grunt: {
        files: ["Gruntfile.js", "package.json"],
        tasks: "default"
      },*/
      javascript: {
        files: ["Gruntfile.js", "src/client/**/*.js", "src/server/*.js", "specs/**/*Spec.js"],
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
      ],
      options: {
        // jshintrc: ".jshintrc"
      }
    },
    shell: {
      options: {
        stderr: false
      },
      target: {
        command: 'mkdir .grunt'
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-shell");


  grunt.registerTask("test", ["jshint","shell", "mochacli", "jasmine"]);
  grunt.registerTask("default", ["test"]);
};




// module.exports = function(grunt) {

//   grunt.initConfig({
//     jshint: {
//       files: ['Gruntfile.js', 'server/**/*.js', 'test/**/*.js', 'client/**/*.js'],
//       options: {
//         globals: {
//           jQuery: true
//         }
//       }
//     },
//     jsdoc: {
//       dist: {
//         src: ['server/**/*.js', 'test/**/*.js', 'client/**/*.js'],
//         options: {
//           destination: 'doc'
//         }
//       }
//     },
//     watch: {
//       files: ['<%= jshint.files %>'],
//       tasks: ['jshint']
//     }
//   });

//   grunt.loadNpmTasks('grunt-contrib-jshint');
//   grunt.loadNpmTasks('grunt-contrib-watch');
//   grunt.loadNpmTasks('grunt-mocha');
//   grunt.loadNpmTasks('grunt-contrib-uglify');
//   grunt.loadNpmTasks('grunt-contrib-concat');
//   grunt.loadNpmTasks('grunt-jsdoc');
//   grunt.loadNpmTasks("grunt-contrib-jasmine");
//   //eventually minification

//   grunt.registerTask('default', ['jshint', 'watch']);
//   grunt.registerTask('docs', ['jsdoc']);
//   //uglify
//   //minify
//   //concat
//   //use nodemon to start node/express application
// };