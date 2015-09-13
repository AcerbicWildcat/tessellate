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

  postImages : function (req, res) {

    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else if (!!req.cookies.facebookToken){
      facebookId = JSON.parse(req.cookies.facebookToken).facebookId;
    }

    cloudinary.uploader.upload(req.file.path, function(result) { 
      guestImageMaker.analyzeGuestImage(req.params.eventId, facebookId, result, function(image){
        res.json(image);
        res.end();
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

