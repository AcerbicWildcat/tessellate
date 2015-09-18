var db = require('./db.js');

var User = db.User;

/**
 * Creates a user and returns that user, or returns an existing user from the dtabase 
 * @param  {String}   facebookId    - the user's Facebook ID.
 * @param  {String}   name          - the user's name.
 * @param  {String}   email         - the user's email.
 * @param  {String}   profPhoto     - the user's profile photo.
 * @param  {String}   facebookToken - the user's facebook token.
 * @param  {Function} done          - callback function (invoked in controller as Resp)
 * @return {Object}                 - user object returned from the database.
 */
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
