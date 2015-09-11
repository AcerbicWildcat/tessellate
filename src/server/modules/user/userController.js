"use strict";

var createUser = require('../../db/createUser.js');
var getUser = require('../../db/getUser.js');
var getEventsByUser = require('../../db/getEventsByUser.js');

module.exports = {

  getUserDetails: function (req, res) {
    getEventsByUser(req.body.facebookId, function(user){
      if (!user){
        res.json("error: user does not exist");
      } else {
        if (user.events){ 
          for (var i = 0; i < user.events.length; i++){
            user.events[i]._creator = user.events[i]._creator.toString();
          }
        }
        res.json(user);
      }
    });
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
  },
  logout: function (req, res) {
    res.json({
      loggedIn: false
    });
  },
  createUser: function(req, res) {
    console.log(req.body, "is our body...");
    var facebookId = req.body.facebookId,
        name = req.body.name,
        profPhoto = req.body.profPhoto,
        email = req.body.email,
        facebookToken = req.body.facebookToken;

    createUser(facebookId, name, email, profPhoto, facebookToken, function(user){
        res.json(user);
    });
  },
  getUser: function(req, res) {
    getUser(req.body.facebookId, function(user){
      res.json(user);
    });
  }
}