var userController = require(__dirname + '/userController');

module.exports = function (app) {

  // Decisions user can make from event page
  app.post('/', userController.handleCode);

};