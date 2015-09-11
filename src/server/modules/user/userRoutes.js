"use strict";

var controller = require(__dirname + '/userController');

module.exports = function (app) {

  /**
   * @namespace /user GET 
   * @desc Returns JSON object of user
   */
  app.get('/', controller.getUserDetails);

  /**
   * @namespace /user GET
   * @desc Logs out user and returns JSON object
   */
  app.get('/logout', controller.logout);

};