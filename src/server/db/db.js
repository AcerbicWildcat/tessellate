var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/3000');
var mapMaker = require('mapmaker.js');

//users have many events, events have one master mosaic image, images
//have one map

var userSchema = mongoose.Schema({
  username: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

var eventSchema = mongoose.Schema({
  _parentUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  username: String,
  tag: String,
  path: String, //path to the main mosaic image.
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"}
});

var mapSchema = mongoose.Schema({
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  data: {},
  height: Number,
  width: Number
});


var User = mongoose.model("User", userSchema);
var Event = mongoose.model("Event", eventSchema);
var Map = mongoose.model("Map", mapSchema);

exports.User = User;
exports.Event = Event;
exports.Map = Map;

//saveEvent will recieve a req.body like the one described below:

// var data = {
//       tag: "#mackevent",
//       path: "../fivebyfive.png",
//       username: "mack"
//     };


var saveEvent = function(req, res){
  var newEvent = new Event({
    /* 
    _parentUser: User.findOne({username: req.body.username})
      .exec(function(err, user){
        return user._id;
      });
    */
    username: req.body.username,
    tag: req.body.tag,
    path: req.body.path,
  })
  .save()
  .then(function(event){
    //ultimately, push the event to its user's array of event ids, and save the user.
    mapMaker.pixelGetter(event.path, event, res)
  });
}

exports.saveEvent = saveEvent;



