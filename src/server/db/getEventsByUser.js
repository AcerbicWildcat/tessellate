var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

module.exports = function(facebookId, done){
  User.findOne({facebookId: facebookId}).select("facbeookId name profPhoto facebookToken events").exec(function(err, user){
    User.populate(user, {path: 'events', select: "_creator name eventCode contributors mainImage"}, function(err, result){
      User.populate(result, {path: 'events.mainImage', model: 'Image', select: 'imgPath'}, function(err, result2){

        done(null, result2);
      });
    });
  });
}