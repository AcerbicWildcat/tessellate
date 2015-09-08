var mongoose = require('mongoose');

var GuestImage = mongoose.Schema({
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  rgb: {}.
  thumbnailPath: String,
  imgPath: String
});

module.exports = GuestImage;