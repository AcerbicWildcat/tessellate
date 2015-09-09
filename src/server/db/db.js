var config = require('../config/config');
var mongoose = require('mongoose');
// var mapMaker = require('./mapmaker.js');

mongoose.connect(config.db.host);

//users have many events, events have one master mosaic image, images
//have one map

var userSchema = require('./collections/User');
var eventSchema = require('./collections/Event');
var mapSchema = require('./collections/Map');
var imageSchema = require('./collections/Image');

var User = mongoose.model("User", userSchema);
var Event = mongoose.model("Event", eventSchema);
var Map = mongoose.model("Map", mapSchema);
var Image = mongoose.model("Image", imageSchema);

exports.User = User;
exports.Event = Event;
exports.Map = Map;
exports.Image = Image;

//is Image a keyword? Is it something we'd need to change?
