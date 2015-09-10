var db = require('./db.js');

var Map = db.Map;

var getMap = function(mapId, callback){
  Map.findOne({_id: mapId}, function(err, map){
    if (!map){
      console.log("error: map not found");
    } else if (map){
      callback(map);
    }
  });
}

var reviseMap = function(mapId, data, callback){
  var conditions = {_id: mapId},
      update     = {data: data},
      options    = {new: true}; //guarantees that the callback returns the saved map object--not the old one.

  Map.findOneAndUpdate(conditions, update, options, function(err, foundMap){
    callback(foundMap);
    //currently, I don't need to send the map back--I just need to update it.
    // res.json(foundMap);
  });
};

exports.getMap = getMap;
exports.reviseMap = reviseMap;