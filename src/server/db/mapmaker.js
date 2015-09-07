var getPixels = require('get-pixels');
var db = require('./db.js');

var User = db.User,
    Event = db.Event,
    Map = db.Map;
//TODO: fix these refs.
//
console.log(db.User + " should be a user constructor");

var chunkSize = 10; //ultimately, we want 10.

/**
 * Saves a map provided an event and a given path to the event's image. Invokes a callback at the end; the provided callback should invoke res.send() or res.end().
 * @param {String}
 * @param  {String}
 * @param  {String}
 * @param  {Function}
 * @return {[type]}
 */
var saveEventAndMap = function(username, filePath, eventCode, callback){
  // var pixels = pixelGetter(filePath); //change argument to (path where images will live) + filePath
  getPixels(filePath, function(err, pixels){
    if (err){
      console.log(err);
      return;
    };
    console.log(pixels + "are our pixels");
    var _storage = chunker(pixels);
    mapEventMaker(username, filePath, _storage, pixels, eventCode, callback);
  });
};


/**
 * invokes getPixels on an image existing at a provided path. Returns an ndArray.
 * @param  {[String]}
 * @return {[ndArray]}
 */
// var pixelGetter = function(filePath){
//   getPixels(filePath, function(err, pixels){
//     if (err){
//       console.log(err);
//       return;
//     };
//     return pixels;
    
//   });
// };

/**
 * Saves a map; associates a map with a given event and an event with the saved map.
 * @param  {[Object]}
 * @param  {[ndArray]}
 * @param  {[Object]}
 * @param  {Function}
 * @return {[type]}
 */
var mapEventMaker = function(username, filePath, _storage, pixels, eventCode, callback){
    //TODO:
    //find a user using req.body.username
    //then, create an event, using user._id as the foreign key.
  User.findOne({username: username}, function(err, user){
    new Event({
      _parentUser: user._id,
      eventCode: eventCode,
      path: filePath
    }).save(function(err, event){
      user.events.push(event); //is this right?
      new Map({
        _parentEvent: event._id,
        data: _storage,
        height: pixels.shape[1],
        width: pixels.shape[0]
      })
      .save(function(err, map){
        console.log(event + "should be the saved event");
        event.map = map._id;
        event.save()
          .then(function(){
            return user.save()
          }).then(function(){
            var returnObj = {
              event: event,
              map: map
            };
            callback(returnObj);
          });
      });
    });
  });
};

/**
 * Invokes chunkMaker and getAverageColor to construct a chunk as a given key of our storage object.
 * @param  {[ndArray]}
 * @return {[Object]}
 */
var chunker = function(pixels){
  var _storage = {};
  var index = 0;
  var chunk;
  for (var i = 0; i < pixels.shape[1]; /*height*/ i+=chunkSize){
    for (var j = 0; j < pixels.shape[0]; /*width*/ j+=chunkSize){
      chunk = chunkMaker(j, i, pixels); /*format: x, y, data*/
      _storage[index++] = {
        coords: [j, i], 
        rgb: getAverageColor(chunk),
        original: true
      };
    }
  }
  return _storage;
};

/**
 * calculates what pixels exist for a given chunk existing at a given set of coordinates (x, y)
 * @param  {[Integer]}
 * @param  {[Integer]}
 * @param  {[ndArray]}
 * @return {[Object]}
 */
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

/**
 * Calculates the average RGB value for pixels in a given chunk.
 * @param  {[Object]}
 * @return {[Object]}
 */
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

exports.saveEventAndMap = saveEventAndMap;

// var returnRGB = function(data){
//   return {
//     r: data[0],
//     g: data[1],
//     b: data[2]
//   }
// }