var db = require('./db.js');

var User = db.User;

module.exports = function(facebookId, name, email, profPhoto, facebookToken, done){

  User.findOne({'facebookId': facebookId}, function (err, user){

    if (err){
      done(err);
    }
    if (user) {
      done(null, user);
    }
    else {
      new User({
        facebookId: facebookId,
        name: name,
        email: email,
        profPhoto: profPhoto,
        facebookToken: facebookToken
      }).save(function (err, user){
        if (err){
          done(err);
        } else {
          done(null, user);
        }
      });
    }
  });

};
