var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Image = db.Image;

//is the facebook id what gets passed along here?

var getEventsByUser = function(facebookId, callback){
  User.findOne({facebookId: facebookId})
    .populate('events')
    .exec(function(err, user){
      var opts = {
        path: 'events.mainImage',
        select: 'imgPath'
      };
      User.populate(user, opts, function(err, result){
        res.json(result);
      });
    });
};

   // BlogPost.create(blogposts, function (err, docs) {
   //    assert.ifError(err);

   //    BlogPost.find({ tags: 'fun' }).lean().populate('author').exec(function (err, docs) {
   //      assert.ifError(err);

   //      var opts = {
   //          path: 'author.friends'
   //        , select: 'name'
   //        , options: { limit: 2 }
   //      }

   //      BlogPost.populate(docs, opts, function (err, docs) {
   //        assert.ifError(err);
   //        console.log();
   //        console.log(docs);
   //        done();
   //      })  

exports.getEventsByUser = getEventsByUser;