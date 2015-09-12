var db = require('./db.js');

var User = db.User;

module.exports = function(facebookId, name, email, profPhoto, facebookToken, callback){

  User.findOne({'facebookId': facebookId}, function (err, user){

    if (err){
      return err;
    }
    if (user) {
      callback(user);
    }
    else {
      new User({
        facebookId: facebookId,
        name: name,
        email: email,
        profPhoto: profPhoto,
        facebookToken: facebookToken
      }).save(function(err, user){
        if (err){
          console.log("createUser DB Save Error:", err);
        }
        callback(user);
      });
    }
  });

};
