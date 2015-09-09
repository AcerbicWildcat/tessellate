var sendResp = require('../../config/helpers').sendResponse,
    dB       = require('../../db/db'),
    mapmaker = require('../../db/mapmaker'),
    cloudinary = require('../image/imageController.js');

module.exports = {

  getEvents: function (req, res) {
    res.json({ events: [] });
  },

  getEvent: function (req, res){
    var eventCode = req.body.eventCode;
    dB.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        sendResp(res, err, 500);
      }
      if (event){
        sendResp(res, {event: event}, 200);
      } else {
        sendResp(res, {event: false}, 404);
      }
    });
  },

  updateEvent: function (req, res){
    res.json({ result: "event updated" });
  },

  createEvent: function (req, res){

    // for debugging
    // console.log(req.file);
    // console.log(req.file.path);

    var eventCode = req.body.eventCode,
        eventName = req.body.eventName,
        facebookId = req.body.facebookId;

    console.log(eventCode + " is our event code");

    dB.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        sendResp(res, err);
      }
      if (event){
        sendResp(res, {event: "sorry, that event code already exists"});
      } else {
        cloudinary.postImages(req, res, function(result){
          console.log(result.url + " is the result we got back!");
          mapmaker.saveEventAndMap(facebookId, result.url, eventCode, eventName, function(returnObj){
            res.json(returnObj);
            sendResp(res);
          });
        });
      }
    });
  }

};