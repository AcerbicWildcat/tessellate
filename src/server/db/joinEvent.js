var db = require('./db.js');

var User = db.User;
var Event = db.Event;


/**
 * Creates a mutual relationship between a user and an event, causing the event to appear on the 'events' and enabling the user to navigate to the event, view the mosaic, and add photos to it.
 * @param  {String}   facebookId - string that identifies the user.
 * @param  {String}   eventCode  - string that identifies the event.
 * @param  {Function} callback   - callback function, invoked when finished.
 * @return {Object}              - object representing the event that was saved. (not currently utilized)
 */
module.exports = function(facebookId, eventCode, callback){
  User.findOne({facebookId: facebookId}, function (err, user){
    if (err){
      callback(err);
    }
    Event.findOne({eventCode: eventCode}, function (err, event){
        console.log("the event exists", event);
      if (err){
        callback(err);
      }
      if (event){
        //check to see if the person trying to join the event is
        //the creator or a contributor.
        //verify what 'done' is doing in this context. Might want to rename it "callback."
        for (var i = 0; i < event.contributors.length; i++){
          if (event.contributors[i].toString() === user._id.toString()){
            callback(null, {error: "You've already joined this event"});
            return;
          }
        }
        if (event._creator.toString() === user._id.toString()){
          callback(null, {error: "Sorry, this is an event you have created"});
          return;
        }
        user.events.push(event);
        event.contributors.push(user);
        event.save(function (err, savedEvent){
          if (err){
            callback(err);
          }
          user.save(function (err){
            if (err){
              callback(err);
            }
            callback(null, savedEvent);
          });
        });
      } else {
        callback(null, {error: "event does not exist"});
      }
    });
  });
};