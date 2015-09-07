var mosaicView = angular.module('tessell.mosaic', []);
  
mosaicView.controller('mosaicCtrl', ['$scope', function ($scope){
  console.log("in mosaic controller");
  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/addphoto', //ultimately, we need to set this route up on the server.
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // console.log(formData, file, xhr);
        formData.append("eventCode", $scope.eventTag);
      },
      'success': function (file, response) {
        console.log('done with sending photo');
        //do a factory method on response.path
      }
    }
  };
}]);

mosaicView.factory('mosaicFactory', ['http', '$scope', function ($http, $scope){
  //$scope 
  //create a function that iterates through the map and appends SVG elements to the
  //SVG on the page.
  var mosaicFactory = {};

  mosaicFactory.init = function(){
    var mainSVG = document.getElementById('mainSVG');
    var mainImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    mainImg.setAttributeNS(null, 'height', $scope.mainImg.height.toString());
    mainImg.setAttributeNS(null, 'width', $scope.mainImg.width.toString());
    mainImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', $scope.mainImg.path); //the path to cloudinary
    mainImg.setAttributeNS(null, 'x', 0);
    mainImg.setAttributeNS(null, 'y', 0);
    mainImg.setAttributeNS(null, 'visibility', 'visible');

    mainSVG.appendChild(mainImg);
    mosaicFactory.redrawImages();  //iterates through the model we're given.
  };

  mosaicFactory.redrawImages = function(){
    for (var key in $scope.eventMap){ //$scope.eventMap is the map returned after the user
      //signs into an event or creates an event.
      if (key.imagePath){
        mosaicFactory.renderImage(key.coords[0], key.coords[1], key, key.imgPath, key.thumbnailPath);
      }
    }
  };

  mosaicFactory.renderImage = function(xCoord, yCoord, ID, imgPath, thumbnailPath){
    var svgImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    svgImg.setAttributeNS(null,'height','10'); //squishes the image down, but still preserves the actual size
    svgImg.setAttributeNS(null,'width','10');
    svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', thumbnailPath);
    svgImg.setAttributeNS(null,'x', xCoord);
    svgImg.setAttributeNS(null,'y', yCoord);
    svgImg.setAttributeNS(null, 'visibility', 'visible');

    var svgLink = document.createElementNS('http://www.w3.org/2000/svg', 'a');
    svgLink.setAttributeNS('http://www.w3.org/1999/xlink','href', imgPath);
    svgLink.setAttributeNS(null,'id','image'+ID);
    svgLink.appendChild(svgImg);

    document.getElementsByClassName('svg-pan-zoom_viewport')[0].appendChild(svgLink);
    //for the above to append, the pan-zoom code snippet needs to have run...
  };

  mosaicFactory.getAverageColor = function(imgPath) {
    //POTENTIAL PROBLEM:
    //These images will corrupt the canvas since they're on cloudinary.
    //the server might need to do the work here.
    var img = new Image();
    //gets garbage collected...
    img.src = imgPath;

    var canvas = document.createElement('canvas');
    //gets garbage collected...
    var ctx = canvas.getContext('2d');
    var width = canvas.width = img.naturalWidth;
    var height = canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    var imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;

    var r = 0;
    var g = 0;
    var b = 0;

    for (var i = 0, l = data.length; i < l; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
    }

    r = Math.floor(r / (data.length / 4));
    g = Math.floor(g / (data.length / 4));
    b = Math.floor(b / (data.length / 4));

    return { r: r, g: g, b: b };

  };

  mosaicFactory.appendImageToSVG = function(imgPath, thumbnailPath){

  // { "_id" : ObjectId("55e65ccc3b1c5de4381f9f68"), "data" : { "0" : { "original" : true, "rgb" : { "b" : 216, "g" : 216, "r" : 216 }, "coords" : [ 0, 0 ] }, "1" : { "original" : true, "rgb" : { "b" : 253, "g" : 253, "r" : 253 }, "coords" : [ 1, 0 ] }, "2" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 0 ] }, "3" : { "original" : true, "rgb" : { "b" : 62, "g" : 140, "r" : 62 }, "coords" : [ 3, 0 ] }, "4" : { "original" : true, "rgb" : { "b" : 62, "g" : 138, "r" : 62 }, "coords" : [ 4, 0 ] }, "5" : { "original" : true, "rgb" : { "b" : 79, "g" : 79, "r" : 79 }, "coords" : [ 0, 1 ] }, "6" : { "original" : true, "rgb" : { "b" : 88, "g" : 88, "r" : 88 }, "coords" : [ 1, 1 ] }, "7" : { "original" : true, "rgb" : { "b" : 178, "g" : 178, "r" : 178 }, "coords" : [ 2, 1 ] }, "8" : { "original" : true, "rgb" : { "b" : 98, "g" : 165, "r" : 98 }, "coords" : [ 3, 1 ] }, "9" : { "original" : true, "rgb" : { "b" : 196, "g" : 226, "r" : 196 }, "coords" : [ 4, 1 ] }, "10" : { "original" : true, "rgb" : { "b" : 162, "g" : 162, "r" : 162 }, "coords" : [ 0, 2 ] }, "11" : { "original" : true, "rgb" : { "b" : 183, "g" : 183, "r" : 183 }, "coords" : [ 1, 2 ] }, "12" : { "original" : true, "rgb" : { "b" : 220, "g" : 220, "r" : 220 }, "coords" : [ 2, 2 ] }, "13" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 3, 2 ] }, "14" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 4, 2 ] }, "15" : { "original" : true, "rgb" : { "b" : 154, "g" : 77, "r" : 91 }, "coords" : [ 0, 3 ] }, "16" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 1, 3 ] }, "17" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 3 ] }, "18" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 3, 3 ] }, "19" : { "original" : true, "rgb" : { "b" : 192, "g" : 192, "r" : 255 }, "coords" : [ 4, 3 ] }, "20" : { "original" : true, "rgb" : { "b" : 139, "g" : 62, "r" : 67 }, "coords" : [ 0, 4 ] }, "21" : { "original" : true, "rgb" : { "b" : 221, "g" : 194, "r" : 197 }, "coords" : [ 1, 4 ] }, "22" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 4 ] }, "23" : { "original" : true, "rgb" : { "b" : 200, "g" : 200, "r" : 255 }, "coords" : [ 3, 4 ] }, "24" : { "original" : true, "rgb" : { "b" : 1, "g" : 1, "r" : 255 }, "coords" : [ 4, 4 ] } }, "height" : 5, "width" : 5, "__v" : 0, "_parentEvent" : ObjectId("55e65cca3b1c5de4381f9f67") }

    var minimums = [];
    var whatChunk;

    //_storage will ultimately be replaced with map.data

    for(var key in _storage){

      //check to see if key is in ignoreKeys before executing the block below.
      var mainRGB = _storage[key].rgb;
      var RGBDistance = Math.sqrt(Math.pow(mainRGB.r - rgb.r, 2) + Math.pow(mainRGB.g - rgb.g, 2) + Math.pow(mainRGB.b - rgb.b, 2));
      //the difference between the average RGB value of the small image and the average RGB value of the large image.
      
      if (whatChunk === undefined){
        whatChunk = _storage[key];
      }

      minimums.push({
        key: key,
        min: RGBDistance
      });
    }


    renderImage(whatChunk.coords[0], whatChunk.coords[1], whatChunk);
    //invoke this when the data comes back from Cloudinary.
  };

  return mosaicFactory;

}]);
