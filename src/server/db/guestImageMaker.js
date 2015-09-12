var getPixels = require('get-pixels');
var db = require('./db.js');
var cloudinary = require('cloudinary');; //TODO: require cloudinary here.

var Event = db.Event,
    Image = db.Image,
    User  = db.User;

var analyzeGuestImage = function(eventID, facebookId, cloudinaryResult, callback){
  getPixels(filePath, function(err, pixels){
    if (err){
      console.log(err);
      return;
    };
    console.log(pixels.length + "should be the length of the pixels we got back...");

    var rgb = getAverageColor(pixels.data); //might have to invoke this on pixels.data

    Event.findOne({eventCode: eventCode}, function(err, foundEvent){
      User.findOne({facebookId: facebookId}, function(err, foundUser){
        new Image({
          _parentEvent: foundEvent._id,
          _parentUser: foundUser._id,
          rgb: rgb,
          thumbnailPath: thumbnailMaker(cloudinaryResponse.public_id, cloudinaryResponse.format),  //TODO: add w_100,h_100,c_fill to the path. Create a helper function for this.
          imgPath: cloudinaryResponse.url
          //TODO: include properties in here.
        }).save(function(err, image){
          foundEvent.images.push(image);
          foundUser.images.push(image);
          foundUser.save(function(){
            foundEvent.save(function(){
              callback();
            });
          });
        });
      });
    });

    //next, create and save an instance of guestImage in the database.
  });
};

var thumbnailMaker = function(name, format){
  var fileName =  name + "." + format;
  return cloudinary.url(name, { width: 100, height: 100, crop: 'fill' });
  //essentially the same as adding w_100,h_100,c_fill to the url path.
};

var getAverageColor = function(pixels) {
  var r = 0;
  var g = 0;
  var b = 0;

  for (var i = 0, l = pixels.length; i < l; i += 4) {
    r += pixels[i];
    g += pixels[i+1];
    b += pixels[i+2];
  };

  r = Math.floor(r / (pixels.length / 4));
  g = Math.floor(g / (pixels.length / 4));
  b = Math.floor(b / (pixels.length / 4));

  return { r: r, g: g, b: b };
};

module.exports = analyzeGuestImage;

