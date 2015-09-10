var db = require('./db.js');
var fs = require('fs');
var util = require('util');

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
        model: 'Image'
      };
      User.populate(docs, opts, function(err, result){
        fs.writeFile('./log.txt', util.inspect(result));
        callback(result);
      });
    });
};
// Car
// .find()
// .populate('partIds')
// .exec(function(err, docs) {
//   if(err) return callback(err);
//   Car.populate(docs, {
//     path: 'partIds.otherIds',
//     model: 'Other'
//   },
//   function(err, cars) {
//     if(err) return callback(err);
//     console.log(cars); // This object should now be populated accordingly.
//   });
// });

exports.getEventsByUser = getEventsByUser;