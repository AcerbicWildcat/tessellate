var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

//is the facebook id what gets passed along here?

var getEventsByUser = function(facebookId, callback){
  User.findOne({facebookId: facebookId}) //recursive population with query is supposedly not supported.
    .populate('events')
    .exec(function(err, docs){
      var opts = {
        path: 'events.mainImage',
        model: 'Image' //could be made more lean... we only want the path, not the other stuff.
      };
      User.populate(docs, opts, function(err, result){
        callback(result);
      });
    });
};

exports.getEventsByUser = getEventsByUser;