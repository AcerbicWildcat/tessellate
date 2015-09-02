var eventController = require(__dirname + '/eventController');

module.exports = function (app) {

  // Decisions user can make from event page
  app.post('/', eventController.handleCode);

};