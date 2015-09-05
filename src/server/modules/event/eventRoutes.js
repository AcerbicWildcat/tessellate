var eventController = require(__dirname + '/eventController');
/*var multer = require('multer');

var upload = multer();*/
module.exports = function (app) {

  // Decisions user can make from event page
  app.post('/join', eventController.findEvent);
  app.post('/create', /*upload.single(),*/ eventController.createEvent);

};