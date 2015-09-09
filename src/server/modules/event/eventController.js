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
    var eventCode = req.body.eventCode;
    dB.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        sendResp(res, err);
      }
      if (event){
        sendResp(res, {event: false});
      } else {
        cloudinary.postImages(req, res, function(result){
          mapmaker.saveEventAndMap("mack", result.url, eventCode, function(returnObj){
            res.json(returnObj);
            sendResp(res);
          });
        });
      }
    });
  }

};