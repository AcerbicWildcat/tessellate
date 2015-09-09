var mongoose = require('mongoose');

var GuestImage = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  rgb: {},
  thumbnailPath: String,
  imgPath: String
});

module.exports = GuestImage;