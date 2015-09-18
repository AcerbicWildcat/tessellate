var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Map = db.Map,
    Image = db.Image;
/**
 * Using eventCode as a key to look up an event in the database, returns an object with the event, the event's main image, and the main image's map. (Note: this can probably be optimized to not send back all fields on each returned object--it's a lot of data to send over the wire.)
 * @param  {String}   eventCode - the eventCode is what we look up our event by.
 * @param  {Function} done      - callback function to send the found event, image and map back to the client.
 * @return {Object}             - object containing the found event, main image, and map.
 */
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