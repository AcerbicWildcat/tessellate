var sendResp = require('../../config/helpers').sendResponse,
    db       = require('../../db/db'),
    mapmaker = require('../../db/mapmaker'),
    getEventAndMap = require('../../db/getEventAndMap'),
    updateEvent = require('../../db/updateEvent'),
    cloudinary = require('cloudinary'),
    getEventsByUser = require('../../db/getEventsByUser.js'),
    joinEvent = require('../../db/joinEvent');
   



module.exports = {

  getEvents: function (req, res, next) {
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else if (!!req.cookies.facebookToken){
      facebookId = req.user.facebookId;
    }
    getEventsByUser(facebookId, function (err, user){
      if (err){
        next(err);
      }
      if (!user){
        sendResp(res, {error: 'Error: User Does Not Exist'}, 404);
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

  getEvent: function (req, res, next){
    var eventCode = req.params.eventId;
    getEventAndMap(eventCode, function (err, event){
      if (err){
        next(err);
      } else {
        sendResp(res, event, 200);
      }
    });
  },

  updateEvent: function (req, res, next){
    updateEvent(req.body.eventCode, req.body.update, function (err, event){
      if (err){
        next(err);
      } else {
        sendResp(res, event, 200);
      }
    });
  },

  createEvent: function (req, res, next){

    var eventCode = req.body.eventCode,
        eventName = req.body.eventName,
        path = req.file.path;
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else if (!!req.cookies.facebookToken){
      facebookId = req.user.facebookId;
    }

    db.Event.findOne({eventCode: eventCode}, function (err, event){
      if (err){
        next(err);
      }
      if (event){
        sendResp(res, {error: "Event Code Already Taken"}, 409);
      } else {
        cloudinary.uploader.upload(path, function (result) {
          var uniformlySizedImageUrl = cloudinary.url(result.public_id, {
              width: 500,
              height: 500,
              crop: 'fill'
            }); 
          console.log(uniformlySizedImageUrl + " is the url for the uniformly sized cloudinary image. HI JIMMY");
          mapmaker.saveEventAndMap(facebookId, uniformlySizedImageUrl, eventCode, eventName, function (err, createdEvent){
            if (err){
              next(err);
            } else {
              sendResp(res, createdEvent, 201);
            }
          });
        });
      }
    });
  },

  joinEvent: function (req, res, next){
    var eventCode = req.params.eventId;
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else if (!!req.cookies.facebookToken){
      facebookId = req.user.facebookId;
    }
    joinEvent(facebookId, eventCode, function (err, event){
      if (err){
        next(err);
      } else {
        getEventAndMap(eventCode, function (err, joinedEvent){
          if (err){
            next(err);
          } else {
            sendResp(res, joinedEvent, 200);
          }
        });
      }
    });

  }  

};