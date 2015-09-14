var sendResp   = require('../../config/helpers').sendResponse,
    db         = require('../../db/db.js'),
    mapHelpers = require('../../db/getAndReviseMap');

var Map      = db.Map;

 //for users trying to view an event.
module.exports = {
  getMap: function(req, res, next){
    mapHelpers.getMap(req.body._id, function (err, map){
      if (err){
        next(err);
      } else {
        sendResp(res, {map: map}, 200);
      }
    });
  },

  saveMap: function(req, res, next){
    mapHelpers.reviseMap(req.body.eventCode, req.body, function (err, map){
      if (err){
        next(err);
      } else {
        sendResp(res, {map: map}, 200);
      }
    });
  }
};