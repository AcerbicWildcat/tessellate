var getPixels = require('get-pixels');
var db = require('./db.js');
var cloudinary = require('cloudinary');; //TODO: require cloudinary here.

var Event = db.Event,
    GuestImage = db.GuestImage;

var analyzeGuestImage = function(filePath, eventID, cloudinaryResponse, callback){
  getPixels(filePath, function(err, pixels){
    if (err){
      console.log(err);
      return;
    };
    console.log(pixels.length + "should be the length of the pixels we got back...");

    var rgb = getAverageColor(pixels); //TODO: what form do pixels come back in? double-check.

    Event.findOne({_id: eventID}, function(err, foundEvent){
      new GuestImage({
        _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
        rgb: rgb,
        thumbnailPath: thumbnailMaker(cloudinaryResponse.public_id, cloudinaryResponse.format),  //TODO: add w_100,h_100,c_fill to the path. Create a helper function for this.
        imgPath: cloudinaryResponse.url
        //TODO: include properties in here.
      }).save();
    })

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
