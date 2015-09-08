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
        res.send(map);
      }
    });
  },

  saveMap: function(req, res){
    var conditions = {_parentEvent: req.body.event._id},
        update     = {data: req.body.event.map.data},
        options    = {new: true}, //guarantees that the callback returns the saved map object.

    Map.findOneAndUpdate(conditions, update, options, function(err, foundMap){
      res.send(foundMap);
    });
  }
};