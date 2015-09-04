var config = require('../config/config');
var mongoose = require('mongoose');
var mapMaker = require('./mapmaker.js');

mongoose.connect(config.db.host);

//users have many events, events have one master mosaic image, images
//have one map

var userSchema = mongoose.Schema({
  username: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

var eventSchema = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  username: String,
  eventCode: String,
  path: String, //path to the main mosaic image.
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"}
});

var mapSchema = mongoose.Schema({
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  data: {},
  height: Number,
  width: Number
});


var User = mongoose.model("User", userSchema);
var Event = mongoose.model("Event", eventSchema);
var Map = mongoose.model("Map", mapSchema);

exports.User = User;
exports.Event = Event;
exports.Map = Map;

