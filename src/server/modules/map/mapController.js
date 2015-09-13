var sendResp   = require('../../config/helpers').sendResponse,
    db         = require('../../db/db.js'),
    mapHelpers = require('../../db/getAndReviseMap');

var Map      = db.Map;

 //for users trying to view an event.
module.exports = {
  getMap: function(req, res){
    mapHelpers.getMap(req.body._id, function(map){
      sendResp(res, {map: map}, 200);
    });
  },

  saveMap: function(req, res){
    mapHelpers.reviseMap(req.body.eventCode, req.body, function(map){
      sendResp(res, {map: map}, 200);
    });
  }
};