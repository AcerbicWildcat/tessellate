// var getPixels = require('get-pixels');
var db = require('./db.js');
var cloudinary = require('cloudinary');; //TODO: require cloudinary here.

var Event = db.Event,
    Image = db.Image,
    User  = db.User;


//TODO: get necesssary RGB value.
var analyzeGuestImage = function(eventCode, facebookId, cloudinaryResult, RGB, done){
  console.dir(RGB, " is our RGB object");
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

var thumbnailMaker = function(name, RGB){
  //{r: r, g: g, b: b}
  
  var rgbToHex = function (R,G,B) {
    return toHex(R)+toHex(G)+toHex(B);
  };

  var toHex = function (n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
  };

  var hex = rgbToHex(RGB.r, RGB.g, RGB.b);

  // var fileName =  name + "." + format;
  return cloudinary.url(name, { 
    width: 10, 
    height: 10, 
    crop: 'fill',
    color: '#' + hex,
    effect: 'colorize:60' 
  });
  //essentially the same as adding w_100,h_100,c_fill to the url path.
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

