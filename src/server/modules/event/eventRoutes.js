var eventController = require(__dirname + '/eventController');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  }
});


var upload = multer({storage: storage});

module.exports = function (app) {

  // Decisions user can make from event page
  app.post('/join', eventController.findEvent);
  app.post('/create', upload.single("file"), eventController.createEvent);
};