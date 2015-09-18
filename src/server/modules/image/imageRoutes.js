'use strict';

var controller = require(__dirname + '/imageController');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  }
});

var upload = multer({storage: storage});

module.exports = function (app) {
  
  /**
   * @namespace /event/image GET
   * @desc Returns JSON object of all events images
   */
  app.get('/', controller.getImages);

  /**
   * @namespace /event/image/:imageId GET
   * @desc Returns JSON object of specific image
   */
  app.get('/:imageId', controller.getImage);

  /**
   * @namespace /event/image/image POST
   * @desc Returns JSON object of all events images
   */
  app.post('/', upload.single("file"), controller.postImages);

  /**
   * @namespace /event/image/:imageId DELETE
   * @desc Returns JSON object of result
   */
  app.delete('/:imageId', controller.deleteImage);

};
