var mongoose = require('mongoose');

var Event = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  guests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  username: String,
  eventCode: String,
  path: String, //path to the main mosaic image.
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"},
  guestImages: [{type: mongoose.Schema.Types.ObjectId, ref: "GuestImage"}]
});

module.exports = Event;