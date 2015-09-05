'use strict';
var fs = require('fs');
var http = require('http');
var util = require('util');
var Busboy = require('busboy');
var cloudinary = require('cloudinary');

cloudinary.config(require(__dirname + '/../../config/config').cloudinary);

module.exports = {
  
  getImages : function (req, res) {
    res.send("Hello from controller");
  },

  postImages : function (req, res, next) {
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

  }

};

