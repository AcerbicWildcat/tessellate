var db = require('./db.js');

var User = db.User;
var Event = db.Event;

module.exports = function(facebookId, eventCode, callback){
  User.findOne({facebookId: facebookId}, function (err, user){
    Event.findOne({eventCode: eventCode}, function (err, event){
      if (event){
        user.events.push(event);
        event.contributors.push(user);
        event.save(function(){
          user.save(function(){
            callback();
          })
        })
      } else {
        console.log("Event Not Found");
      }
    });
  });
};