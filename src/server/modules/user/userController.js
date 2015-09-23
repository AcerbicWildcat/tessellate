"use strict";

var createUser = require('../../db/createUser.js');
var getUser = require('../../db/getUser.js');
var sendResponse = require('../../config/helpers').sendResponse;

module.exports = {

  logout: function (req, res) {
    res.json({
      loggedIn: false
    });
  },
  createUser: function(req, res, next) {
    var facebookId;
    var name = req.body.name,
        profPhoto = req.body.profPhoto,
        email = req.body.email,
        facebookToken = req.body.facebookToken;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }

    createUser(facebookId, name, email, profPhoto, facebookToken, function (err, user){
      if (err){
        next(err);
      } else {
        sendResponse(res, user, 201);
      }
    });
  },
  getUser: function(req, res, next) {
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }
    getUser(facebookId, function (err, user){
      if (err){
        next(err);
      } else {
        res.json(user);
      }
    });
  }
}