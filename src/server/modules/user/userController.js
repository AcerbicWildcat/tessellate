"use strict";

var getEventsByUser = require('../../db/getEventsByUser');
var createUser = require('../../db/createUser');

module.exports = {

  getUserDetails: function (req, res) {
    //getEventsByUser.getEventsByUser();
    res.json({
      _id: {
        toString: function(){return "2as2agskadlawoin"}
      },
      facebookId: "234203kdlsjdf39fjd",
      name: "Borp Junkums III",
      email: "borp@junkums.io",
      profPhoto: "some path",
      facebookToken: {},
      events: [
        {
          _creator: {
            toString: function(){
              return "2as2agskadlawoin";
            }
          },
          contributors: [],
          name: "Borpo's blowout",
          eventCode: "blowout2015",
          mainImage: {
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          },
          images: []
        },
        {
          _creator: {
            toString: function(){
              return "sdflkajsdfj303423";
            }
          },
          contributors: [],
          eventCode: "dingus22",
          name: "Not a Borpo party",
          mainImage: {
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          },
          images: []
        },
        {
          _creator: {
            toString: function(){
              return "9234jsldkjdsfjd";
            }
          },
          contributors: [],
          eventCode: "lamegradstudentparty",
          name: "Totally Awesome Rager",
          mainImage: {
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          },
          images: []
        },
        {
          _creator: {
            toString: function(){
              return "2as2agskadlawoin";
            }
          },
          contributors: [],
          name: "Borpo 2: Electric Borpaloo",
          eventCode: "borp2",
          mainImage: {
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          },
          images: []
        }
      ]
    });
  },
  logout: function (req, res) {
    res.json({
      loggedIn: false
    });
  },
  createUser: function (req, res) {
    createUser.createUser(req.body.facebookId, req.body.name, req.body.email, req.body.profPhoto, req.body.facebookToken);
  }

}