// var getPixels = require('get-pixels');
var db = require('./db.js');
var cloudinary = require('cloudinary');; //TODO: require cloudinary here.

var Event = db.Event,
    Image = db.Image,
    User  = db.User;


/**
 * Creates a guest image for an event, using an eventCode to look up the event by, facebookId to know what user to associate the image with, the cloudinaryResult object to create URL fields for the image, an RGB object to generate a tinted thumbnail URL with, and a callback (done).
 * @param  {String}   eventCode        - the property we look up an event by.
 * @param  {String}   facebookId       - the property we look up a user by.
 * @param  {Object}   cloudinaryResult - the object returned from cloudinary, used to populate image fields with the correct URLs.
 * @param  {Object}   RGB              - an object that looks like {r: Number, g: Number, b: Number}, used to generate a tinted thumbnail URL.
 * @param  {Function} done             - callback invoked on the created image; sends it back the client after saving image to the database.
 * @return {Object}                    - image object saved to the database.
 */
var analyzeGuestImage = function(eventCode, facebookId, cloudinaryResult, RGB, done){
  // getPixels(cloudinaryResult.url, function (err, pixels){
  //   if (err){
  //     done(err);
  //   };

    // var rgb = getAverageColor(pixels.data);

    Event.findOne({eventCode: eventCode}, function (err, foundEvent){
      if (err){
        done(err);
      }
      User.findOne({facebookId: facebookId}, function (err, foundUser){
        if (err){
          done(err);
        }
        new Image({
          _parentEvent: foundEvent._id,
          _parentUser: foundUser._id,
          // rgb: rgb,
          thumbnailPath: thumbnailMaker(cloudinaryResult.public_id, RGB),
          // imgPath: cloudinaryResult.url
          //TODO: include properties in here.
        }).save(function (err, image){
          if (err){
            done(err);
          }
          foundEvent.images.push(image);
          foundUser.images.push(image);
          foundUser.save(function(){
            foundEvent.save(function(){
              done(null, image);  //invoked on the entire saved image.
            });
          });
        });
      });
    });
  // });
};
/**
 * Provided a cloudinary filename and an RGB object, creates a thumbnail URL that produces a tinted version of an image on cloudinary.
 * @param  {String} name - name of the file on cloudinary; extracted from the response object cloudinary produces.
 * @param  {Object} RGB  - object that looks like {r: Number, g: Number, b: Number}.
 * @return {String}      - the cloudinary URL for the tinted thumbnail image.
 */
var thumbnailMaker = function(name, RGB){
  
  /**
   * Concatenates three strings to create a hex RGB value.
   * @param  {Number} R - red value.
   * @param  {Number} G - green value.
   * @param  {Number} B - blue value.
   * @return {String}   - hex string representing an RGB value.
   */
  var rgbToHex = function (R,G,B) {
    return toHex(R)+toHex(G)+toHex(B);
  };

  /**
   * Given a number n between 0 and 255 inclusive, returns a hex value representing the number.
   * @param  {Number} n - the number.
   * @return {String}   - the returned string.
   */
  var toHex = function (n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
  };

  var hex = rgbToHex(RGB.r, RGB.g, RGB.b);

  return cloudinary.url(name, { 
    width: 10, 
    height: 10, 
    crop: 'fill',
    color: '#' + hex,
    effect: 'colorize:60' 
  });
};

// var getAverageColor = function(pixels) {
//   var r = 0;
//   var g = 0;
//   var b = 0;

//   for (var i = 0, l = pixels.length; i < l; i += 4) {
//     r += pixels[i];
//     g += pixels[i+1];
//     b += pixels[i+2];
//   };

//   r = Math.floor(r / (pixels.length / 4));
//   g = Math.floor(g / (pixels.length / 4));
//   b = Math.floor(b / (pixels.length / 4));

//   return { r: r, g: g, b: b };
// };

exports.analyzeGuestImage = analyzeGuestImage;
exports.thumbnailMaker = thumbnailMaker;
// exports.getAverageColor = getAverageColor;

