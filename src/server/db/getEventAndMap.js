var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Map = db.Map,
    Image = db.Image;

module.exports = function(eventCode, callback){
  var returnObj;
  Event.findOne({eventCode: eventCode})
    .exec(function(err, event){
      if (event){ //if an event is found...
        Image.findOne({_id: event.mainImage})
          .exec(function(err, image){
            Map.findOne({_parentImage: image._id})
              .exec(function(err, map){
                returnObj = {
                  event: event,
                  image: image,
                  map: map
                };
                callback(returnObj);
              })
          });
      } else {
        callback("error: no event found");
      }
    });
};