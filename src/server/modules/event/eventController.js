var sendResp = require('../../config/helpers').sendResponse,
    db       = require('../../db/db'),
    mapmaker = require('../../db/mapmaker'),
    getEventAndMap = require('../../db/getEventAndMap'),
    cloudinary = require('../image/imageController.js');
    getEventsByUser = require('../../db/getEventsByUser.js');


module.exports = {

  getEvents: function (req, res) {
    getEventsByUser(req.body.facebookId, function(user){
      if (!user){
        res.json("error: user does not exist");
      } else {
        if (user.events){ 
          for (var i = 0; i < user.events.length; i++){
            user.events[i]._creatorString = user.events[i]._creator.toString();
          }
        }
        user._idString = user._id.toString();
        res.json(user);
      }
    });
  },

    // res.json({
    //   _id: {
    //     toString: function(){return "2as2agskadlawoin"}
    //   },
    //   facebookId: "234203kdlsjdf39fjd",
    //   name: "Borp Junkums III",
    //   email: "borp@junkums.io",
    //   profPhoto: "some path",
    //   facebookToken: {},
    //   events: [
    //     {
    //       _creator: "2as2agskadlawoin",
    //       contributors: [],
    //       name: "Borpo's blowout",
    //       eventCode: "blowout2015",
    //       mainImage: {
    //         imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
    //       },
    //       images: []
    //     },
    //     {
    //       _creator: "sdflkajsdfj303423",
    //       contributors: [],
    //       eventCode: "dingus22",
    //       name: "Not a Borpo party",
    //       mainImage: {
    //         imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
    //       },
    //       images: []
    //     },
    //     {
    //       _creator: "9234jsldkjdsfjd",
    //       contributors: [],
    //       eventCode: "lamegradstudentparty",
    //       name: "Totally Awesome Rager",
    //       mainImage: {
    //         imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
    //       },
    //       images: []
    //     },
    //     {
    //       _creator: "2as2agskadlawoin",
    //       contributors: [],
    //       name: "Borpo 2: Electric Borpaloo",
    //       eventCode: "borp2",
    //       mainImage: {
    //         imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
    //       },
    //       images: []
    //     }
    //   ]
    // });

  getEvent: function (req, res){
    var eventCode = req.body.eventCode;
    getEventAndMap(eventCode, function(obj){
      if (typeof obj === "string"){
        sendResp(res, obj, 404);
        // res.json(obj);
      } else {
        sendResp(res, obj, 200);
        // res.json(obj);
      }
    });
  },

  updateEvent: function (req, res){
    res.json({ result: "event updated" });
  },

  createEvent: function (req, res){

    // for debugging
    // console.log(req.file);
    // console.log(req.file.path);

    var eventCode = req.body.eventCode,
        eventName = req.body.eventName,
        facebookId = req.body.facebookId;

    // console.log(eventCode + " is our event code...");
    // console.log(eventName + " is our event name...");
    // console.log(facebookId + " is our facebookId...");

    db.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        sendResp(res, err);
      }
      if (event){
        sendResp(res, {event: "sorry, that event code already exists"});
      } else {
        cloudinary.postImages(req, res, function(result){
          console.log(result.url + " is the result we got back!");
          mapmaker.saveEventAndMap(facebookId, result.url, eventCode, eventName, function(returnObj){
            res.json(returnObj);
            sendResp(res);
          });
        });
      }
    });
  }

};