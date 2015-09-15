'use strict';
var fs = require('fs');
var http = require('http');
var Busboy = require('busboy');
var cloudinary = require('cloudinary');
var guestImageMaker = require('../../db/guestImageMaker');


cloudinary.config(require(__dirname + '/../../config/config').cloudinary);

module.exports = {

  getImages : function (req, res) {
    res.json({ image: {} });
  },  

  getImage : function (req, res) {
    res.json({ image: {} });
  },

  postImages : function (req, res, next) {
    // Look for facebookId on headers (Mobile) or
    // in cookies (Desktop)
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }
    // Look for image file on body (Mobile) or
    // req.file.path (Desktop)
    var imagePath;
    if (!!req.file.path){
      imagePath = req.file.path;
    } else {
      imagePath = JSON.parse(req.body).image;
    }

    // console.log("inside imgaeController--->", req.file);
    cloudinary.uploader.upload(imagePath, function (result) { 
      guestImageMaker.analyzeGuestImage(req.params.eventId, facebookId, result, function (err, image){
        if (err){
          next(err);
        } else {
          res.json(image);
          res.end();
        }
      }); 
    });

    // var busboy = new Busboy({ headers: req.headers });
    // var stream = cloudinary.uploader.upload_stream(function(result) {
    //   //TODO: write result to db
    //   res.json(result);
    // });

    // busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //   file.pipe(stream);
    // });
    // busboy.on('finish', function() {
    //   res.writeHead(200, { 'Connection': 'close' });
    //   res.end("That's all folks!");
    // });
    // // return req.pipe(busboy);
    // req.pipe(busboy);

  },

  deleteImage: function (req, res) {
    res.json({ deleted: true });
  }

};

