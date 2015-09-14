var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Map = db.Map,
    Image = db.Image;

module.exports = function(eventCode, done){
  var targetEvent;
  Event.findOne({eventCode: eventCode})
    .exec(function (err, event){
      if (err){
        done(err);
      }
      if (event){
        Image.findOne({_id: event.mainImage})
          .exec(function (err, image){
            if (err){
              done(err);
            }
            Map.findOne({_parentImage: image._id})
              .exec(function (err, map){
                if (err){
                  done(err);
                }
                targetEvent = {
                  event: event,
                  image: image,
                  map: map
                };
                done(null, targetEvent);
              })
          });
      } else {
        done(404);
      }
    });
};