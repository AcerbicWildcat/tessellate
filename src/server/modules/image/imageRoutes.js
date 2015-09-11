'use strict';

var controller = require(__dirname + '/imageController');

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
  app.post('/', controller.postImages);

  /**
   * @namespace /event/image/:imageId DELETE
   * @desc Returns JSON object of result
   */
  app.delete('/:imageId', controller.deleteImage);

};