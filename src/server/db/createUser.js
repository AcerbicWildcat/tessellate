var db = require('./db.js');

var User = db.User;

var createUser = function(facebookId, name, email, profPhoto, facebookToken, callback){

  new User({
    facebookId: facebookId,
    name: name,
    email: email,
    profPhoto: profPhoto,
    facebookToken: facebookToken
  }).save(function(err, user){
    callback(user);
  });

};

exports.createUser = createUser;
