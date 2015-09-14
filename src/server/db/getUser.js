var db = require('./db.js');

var User = db.User;

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
