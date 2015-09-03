var getPixels = require('get-pixels');
var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Map = db.Map;


var chunkSize = 10; //ultimately, we want 10.

//the first argument for getPixels should also be a file path contained on req.body.path.

var pixelGetter = function(path, event, res){
  //eventually, replace path with req.body.path.
  getPixels(path, function(err, pixels){
    if (err){
      console.log(err);
      return;
    };
    chunker(pixels, function(_storage){
      // res.send(_storage);
      var theMap = new Map({
        data: _storage,
        height: pixels.shape[1],
        width: pixels.shape[0]
      }).save(function(err, map){
        console.log(event + "should be the saved event");
        event.map = map._id;
        map._parentEvent = event._id;
        event.save()
          .then(function(){
            return map.save();
          })
          .then(function(){
            res.end();
          });
      });
    });
  });
};

var chunker = function(pixels, callback){
  var _storage = {};
  var index = 0;
  for (var i = 0; i < pixels.shape[1]; /*height*/ i+=chunkSize){
    for (var j = 0; j < pixels.shape[0]; /*width*/ j+=chunkSize){
      var chunk = chunkMaker(j, i, pixels); /*format: x, y, data*/
      _storage[index++] = {
        coords: [j, i], 
        rgb: getAverageColor(chunk),
        original: true
      }
    }
  }
  callback(_storage);
}

var chunkMaker = function(x, y, pixels){
  var chunk = []; //construct a flat array of pixels scanning left to right, top to bottom.
  //pixels.get(x, y, z)
  for (var i = y; i < (y + chunkSize); i++){ //outer loop: height.
    for (var j = x; j < (x + chunkSize); j++){ //inner loop: width:
      for (var k = 0; k < 4; k++){ //inner-inner loop: depth (rgba values for each pixel)
        chunk.push(pixels.get(j, i, k));
      }
    }
  }
  return chunk;
};


var getAverageColor = function(chunk) {
  var r = 0;
  var g = 0;
  var b = 0;

  for (var i = 0, l = chunk.length; i < l; i += 4) {
    r += chunk[i];
    g += chunk[i+1];
    b += chunk[i+2];
  };

  r = Math.floor(r / (chunk.length / 4));
  g = Math.floor(g / (chunk.length / 4));
  b = Math.floor(b / (chunk.length / 4));

  return { r: r, g: g, b: b };
};

exports.pixelGetter = pixelGetter;

// var returnRGB = function(data){
//   return {
//     r: data[0],
//     g: data[1],
//     b: data[2]
//   }
// }