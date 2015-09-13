var db = require('./db.js');

var Map = db.Map;
var Event = db.Event;
var Image = db.Image;

// var getMap = function(mapId, callback){
//   Map.findOne({_id: mapId}, function(err, map){
//     if (!map){
//       console.log("error: map not found");
//     } else if (map){
//       callback(map);
//     }
//   });
// }

var reviseMap = function(eventCode, revision, callback){
  console.log(revision.key, revision.value, " is our revision...")
  var data;
  Event.findOne({eventCode: eventCode}, function(err, event){
    Image.findOne({_id: event.mainImage}, function(err, image){
      Map.findOne({_id: image.map}, function(err, map){
        data = map.data;
        console.log(data[revision.key], " was the old key");
        data[revision.key] = revision.value;
        console.log(data[revision.key], " is the new key");

        var conditions = {_id: map._id},
            update     = {data: data},
            options    = {new: true}; //guarantees that the callback returns the saved map object--not the old one.
        Map.findOneAndUpdate(conditions, update, options, function(err, foundMap){
          callback(foundMap);
          //currently, I don't need to send the map back--I just need to update it.
          // res.json(foundMap);
        });
      });
    })
  });
};

// exports.getMap = getMap;
exports.reviseMap = reviseMap;