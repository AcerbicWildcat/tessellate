var eventController = require(__dirname + '/eventController');

module.exports = function (app) {

  // Decisions user can make from event page
  app.post('/join', eventController.findEvent);
  app.post('/create', eventController.createEvent);

};