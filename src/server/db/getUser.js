var db = require('./db.js');

var User = db.User;

module.exports = function(facebookId, callback){
  User.findOne({
    facebookId: facebookId
  })
  .exec(function(err, user){
    callback(user);
  });
};
