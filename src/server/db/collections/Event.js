var mongoose = require('mongoose');

var Event = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  username: String,
  eventCode: String,
  path: String, //path to the main mosaic image.
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"}
});

module.exports = Event;