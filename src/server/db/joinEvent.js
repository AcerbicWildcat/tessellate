var db = require('./db.js');

var User = db.User;
var Event = db.Event;

module.exports = function(facebookId, eventCode, done){
  User.findOne({facebookId: facebookId}, function (err, user){
    if (err){
      done(err);
    }
    Event.findOne({eventCode: eventCode}, function (err, event)
      {
        console.log("the event exists", event);
      if (err){
        done(err);
      }
      if (event){
        //check to see if the person trying to join the event is
        //the creator or a contributor.
        //verify what 'done' is doing in this context. Might want to rename it "callback."
        for (var i = 0; i < event.contributors.length; i++){
          if (event.contributors[i].toString() === user._id.toString()){
            done(null, {error: "You've already joined this event"});
            return;
          }
        }
        if (event._creator.toString() === user._id.toString()){
          done(null, {error: "Sorry, this is an event you have created"});
          return;
        }
        user.events.push(event);
        event.contributors.push(user);
        event.save(function (err){
          if (err){
            done(err);
          }
          user.save(function (err){
            if (err){
              done(err);
            }
            done(null, event);
          });
        });
      } else {
        done(null, {error: "event does not exist"});
      }
    });
  });
};