var eventController = require(__dirname + '/eventController');
var multer = require('multer');

var imageController = require('../image/imageController');

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

   /**
   * @namespace /event/image GET
   * @desc Returns JSON object of all events images
   */
  app.get('/:eventId/images', imageController.getImages);

  /**
   * @namespace /event/image/:imageId GET
   * @desc Returns JSON object of specific image
   */
  app.get('/:eventId/image/:imageId', imageController.getImage);

  /**
   * @namespace /event/image/image POST
   * @desc Returns JSON object of all events images
   */
  app.post('/:eventId/image', upload.single("file"), imageController.postImages);

  /**
   * @namespace /event/image/:imageId DELETE
   * @desc Returns JSON object of result
   */
  app.delete('/:imageId', imageController.deleteImage);

};