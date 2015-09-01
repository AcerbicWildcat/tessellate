'use strict';

var controller = require(__dirname + '/cloudinary.controller');

module.exports = function (app) {
  
  app.get('/', controller.getImages);

  app.post('/', controller.postImages);

};