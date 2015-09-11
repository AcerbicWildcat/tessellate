"use strict";

var createUser = require('../../db/createUser.js');
var getUser = require('../../db/getUser.js');

module.exports = {

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