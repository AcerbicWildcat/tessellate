var mapController = require(__dirname + '/mapController');

module.exports = function (app) {

  // Decisions user can make from event page
  app.get('/', mapController.getMap);
  app.post('/', mapController.saveMap);

};