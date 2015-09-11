var mongoose = require('mongoose');

//can be either a main image with a map property or contributor image with an rgb property.

var Image = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  rgb: {},
  thumbnailPath: String, //only has this if the image is a contributor image.
  imgPath: String,
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"}
});

module.exports = Image;
