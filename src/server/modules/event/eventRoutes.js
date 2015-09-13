var eventController = require(__dirname + '/eventController');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  }
});

var upload = multer({storage: storage});

module.exports = function (app) {

  /**
   * @namespace /event GET
   * @desc Returns JSON object of all users events
   */
  app.get('/', eventController.getEvents);

  /**
   * @namespace /event/:eventId GET
   * @desc Returns JSON object of event
   */
  app.get('/:eventId', eventController.getEvent);

  /**
   * @namespace /event:eventId
   * @desc Returns JSON object of event
   */
  app.put('/:eventId', eventController.updateEvent);

  /**
   * @namespace /event:eventId
   * @desc Returns JSON object of event
   */
  app.post('/:eventId', eventController.joinEvent);
  
  /**
   * @namespace /event POST
   * @desc Returns JSON object of created event
   */
  app.post('/', upload.single("file"), eventController.createEvent);

};