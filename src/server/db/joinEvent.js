var db = require('./db.js');

var User = db.User;
var Event = db.Event;

module.exports = function(facebookId, eventCode, done){
  User.findOne({facebookId: facebookId}, function (err, user){
    if (err){
      done(err);
    }
    Event.findOne({eventCode: eventCode}, function (err, event){
      if (err){
        done(err);
      }
      if (event){
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
        done(404);
      }
    });
  });
};