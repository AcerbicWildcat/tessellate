var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;
/**
 * Finds a user and populates that user with all of the events that user has joined. Returned document excludes fields containing images that the user has taken and images that are associated with found events in order to reduce the amount of information traveling over the wire.
 * @param  {String}   facebookId - The Facebook ID used to find the user in the database.
 * @param  {Function} done       - callback function, used to send the constructed document back to the client.
 * @return {Object}              - document populated with the information described above.
 */
module.exports = function(facebookId, done){
  User.findOne({facebookId: facebookId}).select("facbeookId name profPhoto facebookToken events").exec(function(err, user){
    if(err){
      done(err);
    }
    User.populate(user, {path: 'events', select: "_creator name eventCode contributors mainImage"}, function(err, result){
      if(err){
        done(err);
      }
      User.populate(result, {path: 'events.mainImage', model: 'Image', select: 'imgPath'}, function(err, result2){
        if(err){
          done(err);
        }
        done(null, result2);
      });
    });
  });
}