var sendResp = require('../../config/helpers').sendResponse,
    db       = require('../../db/db.js');

var Map      = db.Map;

 //for users trying to view an event.
module.exports = {
  getMap: function(req, res){
    Map.findOne({_parentEvent: req.body.event._id}, function(err, map){
      if (!map){
        console.log("error: map not found");
      } else if (map){
        sendResp(res, {map: map}, 200);
      }
    });
  },

  saveMap: function(req, res){
    var conditions = {_id: req.body._id},
        update     = {data: req.body.data},
        options    = {new: true}, //guarantees that the callback returns the saved map object--not the old one.

    Map.findOneAndUpdate(conditions, update, options, function(err, foundMap){
      sendResp(res);
      //currently, I don't need to send the map back--I just need to update it.
      // res.json(foundMap);
    });
  }
};