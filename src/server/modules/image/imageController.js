'use strict';
var fs = require('fs');
var http = require('http');
var Busboy = require('busboy');
var cloudinary = require('cloudinary');
var guestImageMaker = require('../../db/guestImageMaker');
var util = require('util');
var getEventAndMap = require('../../db/getEventAndMap');
var getAndReviseMap = require('../../db/getAndReviseMap');


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

    var eventCode = req.params.eventId;

    // Take slice off end of remaining unfilledKeys; adjust sliceLength to control
    // # of times each image is used in mosaic
    var sliceLength = 1;
    var unfilledKeysSlice;
    getEventAndMap(eventCode, function (err, event){
      unfilledKeysSlice = event.map.unfilledKeys.splice(-sliceLength,sliceLength);
    });

    cloudinary.uploader.upload(imagePath, function (result) {
      var tintedImages = [];
      for (var i = 0; i < sliceLength; i++){ 
        guestImageMaker.analyzeGuestImage(eventCode, facebookId, result, unfilledKeysSlice[i].value.originalRGB, function (err, image){
          if (err){
            next(err);
          } 
          tintedImages.push(image);
          if (tintedImages.length === sliceLength){
            findImageHome(tintedImages);
          }
        });
      }; 
    });

    // use array of tintedImage url's and current slice of unfilledKeys
    var findImageHome = function(tintedImages){
      var segmentsToUpdate = [];
      for (var i = 0; i < tintedImages.length; i++){
        var segmentToUpdate = unfilledKeysSlice[i].value;
        segmentToUpdate.ID = unfilledKeysSlice[i].key;
        segmentToUpdate.imgPath = tintedImages[i].imgPath;
        segmentToUpdate.thumbnailPath = tintedImages[i].thumbnailPath;

        segmentsToUpdate.push(segmentToUpdate);
      }
      // Revise map in DB and send revised map back with response
      getAndReviseMap.reviseMap(eventCode, segmentsToUpdate, function (err, map){
        if (err){
          next(err);
        }
        res.json(map);
        res.end();
      });

    };

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

