var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

//is the facebook id what gets passed along here?

module.exports = function(facebookId, done){
  User.findOne({facebookId: facebookId}) //recursive population with query is supposedly not supported.
    .populate('events')
    .exec(function (err, docs){
      if (err){
        done(err);
      }
      var opts = {
        path: 'events.mainImage',
        model: 'Image' //could be made more lean... we only want the path, not the other stuff.
      };
      User.populate(docs, opts, function (err, result){
        if (err){
          done(err);
        } else {
          done(null, result);
        }
      });
    });
};