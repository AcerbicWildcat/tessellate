'use strict';
var fs = require('fs');
var http = require('http');
var util = require('util');
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

  //TODO: after we get the image back from the server, let's
  //run get-pixels on it. It might make sense to require it in the body
  //of this module and just invoke it here.
  //TODO: figure out a way to get a 200x200 thumbnail back from Cloudinary.
  //to review tomorrow.
  //maybe build a separate db function that does all of this!! Require it in this
  //module. This will give us everything we need, as long as we attach
  //the parent event _id to req.body.
  addImages : function (req, res, next) {

    cloudinary.uploader.upload(req.file.path, function(result) { 
      next(result); 
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

