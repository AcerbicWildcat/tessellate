var mongoose = require('mongoose');

var Event = mongoose.Schema({
  _creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  contributors: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  name: String,
  eventCode: String,
  mainImage: {type: mongoose.Schema.Types.ObjectId, ref: "Image"},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: "Image"}]
});

module.exports = Event;