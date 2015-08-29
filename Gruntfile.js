module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'server/**/*.js', 'test/**/*.js', 'client/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['server/**/*.js', 'test/**/*.js', 'client/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');
  //eventually minification

  grunt.registerTask('default', ['jshint', 'watch']);
  grunt.registerTask('docs', ['jsdoc']);
  //uglify
  //minify
  //concat
  //use nodemon to start node/express application
};

//tasks to run testing