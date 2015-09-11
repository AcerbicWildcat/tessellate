var db = require('./db.js');

var User = db.User;

module.exports = function(facebookId, name, email, profPhoto, facebookToken, callback){

  for (var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  };

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
