var db = require('./db.js');

var User = db.User;
/**
 * Finds a user using facebookId argument and returns the user using a callback.
 * @param  {String}   facebookId - the Facebook ID used to look the user up by.
 * @param  {Function} done       - the callback invoked on the found user (or the error).
 * @return {Object}              - the user object found in the db.
 */
module.exports = function(facebookId, done){
  User.findOne({
    facebookId: facebookId
  })
  .exec(function (err, user){
    if (err){
      done(err);
    } else {
      done(null, user);
    }
  });
};
