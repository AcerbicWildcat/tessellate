var config = require('../config/config');
var mongoose = require('mongoose');
var testMapData = require('./log.js');

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

/*User.create({name: "Jonathan"}, function(err, user){
  new Event({
    _creator: user._id,
    name: "Jonathan party",
    eventCode: "jon"
  }).save(function(err, party){
    user.events.push(party);
    new Image({
      _parentUser: user._id,
      _parentEvent: party._id,
      imgPath: "http://res.cloudinary.com/tesselate/image/upload/v1442029493/qt2zqlwgv2iypxpca0mw.png",
      thumbnailPath: "http://res.cloudinary.com/tesselate/image/upload/w_100,h_100,c_fill/qt2zqlwgv2iypxpca0mw.png"
    }).save(function(err, image){
      party.mainImage = image._id;
      new Map({
        parentImage: image._id,
        data: testMapData(),
        width: 900,
        height: 900
      }).save(function(err, map){
        image.map = map._id;
        user.save(function(){
          party.save(function(){
            image.save();
          });
        })
      });
    })
  });
});*/

//is Image a keyword? Is it something we'd need to change?
