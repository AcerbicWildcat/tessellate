var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

//is the facebook id what gets passed along here?

module.exports = function(facebookId, done){
  User.findOne({facebookId: facebookId}).select("facbeookId name profPhoto facebookToken events").exec(function(err, user){
    User.populate(user, {path: 'events', select: "_creator name eventCode contributors mainImage"}, function(err, result){
      User.populate(result, {path: 'events.mainImage', model: 'Image', select: 'imgPath'}, function(err, result2){

        done(null, result2);
      });
    });
  });
  //   User.populate(user, {path: 'events', select: "_creator name eventCode name contributors"}, function(err, result){
  //       done(null, result);
  //   });
  // }); 

}//recursive population with query is supposedly not supported.
//     .populate('events', "_creator")
//     .exec(function (err, docs){
//       if (err){
//         done(err);
//       }
//       var opts = {
//         path: 'events.mainImage',
//         model: 'Image' //could be made more lean... we only want the path, not the other stuff.
//       };
//       User.populate(docs, opts, function (err, result){
//         if (err){
//           done(err);
//         } else {
//           done(null, result);
//         }
//       });
//     });
// };