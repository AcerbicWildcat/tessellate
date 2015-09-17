var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

module.exports = function(facebookId, done){
  User.findOne({facebookId: facebookId}).select("facbeookId name profPhoto facebookToken events").exec(function(err, user){
    if(err){
      done(err);
    }
    User.populate(user, {path: 'events', select: "_creator name eventCode contributors mainImage"}, function(err, result){
      if(err){
        done(err);
      }
      User.populate(result, {path: 'events.mainImage', model: 'Image', select: 'imgPath'}, function(err, result2){
        if(err){
          done(err);
        }
        done(null, result2);
      });
    });
  });
}