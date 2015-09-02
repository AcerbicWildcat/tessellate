var _storage = {};

/*
* rgb: {r: integer, g: integer, b: integer}
  coords: [x, y],
  original: true/false,
  minumum: ingeger,
*/



var index = 0;

var canvas = document.createElement('canvas');
canvas.setAttribute('width', '850');
canvas.setAttribute('height', '250');
var context = canvas.getContext('2d');

console.log(canvas);

//one option we have for calculating averages server-side is to
//use node get-pixels package.

var img = new Image();
img.src = "./hackreactor.jpg"
img.onload = function(){
  context.drawImage(img, 0, 0);
  chunker(img);
}


/*
* Gets the average color for any 
 */
function getAverageColor(imgOrData, what) {
  if (what === "img"){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = imgOrData.naturalWidth;
    var height = canvas.height = imgOrData.naturalHeight;

    ctx.drawImage(imgOrData, 0, 0);

    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;
  } else {
    data = imgOrData;
  }
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
}

/*
* Chunker takes one parameter: imgEl, which accepts an image element.
* it iterates over the image, breaking it into chunks, gets the average
* RGB value for each chunk, and saves it to a global _storage variable.
* @param {object} imgEl - the image to be chunked.
* it iterates over the image, breaking it into 
 */

var chunker = function(imgEl) {

    var context = canvas.getContext && canvas.getContext('2d');
    var chunk;

    context.drawImage(imgEl, 0, 0); //draws an image to the canvas.

    var pixelSize = 10;
    for (var i = 0; i < imgEl.height; i+=pixelSize){
      for (var j = 0; j < imgEl.width; j+=pixelSize){
        chunk = context.getImageData(j, i, pixelSize, pixelSize);  //format: x offset, y offset, width, height
        _storage[index++] = {
          rgb: getAverageColor(chunk.data),
          coords: [j, i],
          original: true
        }
      }
    }
    
};


document.ondragover = function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

document.ondrop = function(event) {
  event.preventDefault();

  document.getElementById('images').innerHTML = '';

  var files = event.dataTransfer.files;
  for (var i = 0; i < files.length; i++) {
    addImage(files[i]);
  }
};


function addImage(file) {
  var element = document.createElement('div');
  element.className = 'row';
  element.innerHTML =
    '<div class="cell image">' +
    '  <img />' +
    '</div>' +
    '<div class="cell color">' +
    '  <div class="box"></div>' +
    '  <ul>' +
    '    <li class="rgb"></li>' +
    '  </ul>' +
    '</div>';

  var img = element.querySelector('img');
  img.src = URL.createObjectURL(file);
  img.onload = function() {
    var rgb = getAverageColor(img, "img");
    addToSVG(img, rgb);
  };
}

function addToSVG (img, rgb, ignoreKeys) {

  ignoreKeys = ignoreKeys || {};

  // { "_id" : ObjectId("55e65ccc3b1c5de4381f9f68"), "data" : { "0" : { "original" : true, "rgb" : { "b" : 216, "g" : 216, "r" : 216 }, "coords" : [ 0, 0 ] }, "1" : { "original" : true, "rgb" : { "b" : 253, "g" : 253, "r" : 253 }, "coords" : [ 1, 0 ] }, "2" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 0 ] }, "3" : { "original" : true, "rgb" : { "b" : 62, "g" : 140, "r" : 62 }, "coords" : [ 3, 0 ] }, "4" : { "original" : true, "rgb" : { "b" : 62, "g" : 138, "r" : 62 }, "coords" : [ 4, 0 ] }, "5" : { "original" : true, "rgb" : { "b" : 79, "g" : 79, "r" : 79 }, "coords" : [ 0, 1 ] }, "6" : { "original" : true, "rgb" : { "b" : 88, "g" : 88, "r" : 88 }, "coords" : [ 1, 1 ] }, "7" : { "original" : true, "rgb" : { "b" : 178, "g" : 178, "r" : 178 }, "coords" : [ 2, 1 ] }, "8" : { "original" : true, "rgb" : { "b" : 98, "g" : 165, "r" : 98 }, "coords" : [ 3, 1 ] }, "9" : { "original" : true, "rgb" : { "b" : 196, "g" : 226, "r" : 196 }, "coords" : [ 4, 1 ] }, "10" : { "original" : true, "rgb" : { "b" : 162, "g" : 162, "r" : 162 }, "coords" : [ 0, 2 ] }, "11" : { "original" : true, "rgb" : { "b" : 183, "g" : 183, "r" : 183 }, "coords" : [ 1, 2 ] }, "12" : { "original" : true, "rgb" : { "b" : 220, "g" : 220, "r" : 220 }, "coords" : [ 2, 2 ] }, "13" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 3, 2 ] }, "14" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 4, 2 ] }, "15" : { "original" : true, "rgb" : { "b" : 154, "g" : 77, "r" : 91 }, "coords" : [ 0, 3 ] }, "16" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 1, 3 ] }, "17" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 3 ] }, "18" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 3, 3 ] }, "19" : { "original" : true, "rgb" : { "b" : 192, "g" : 192, "r" : 255 }, "coords" : [ 4, 3 ] }, "20" : { "original" : true, "rgb" : { "b" : 139, "g" : 62, "r" : 67 }, "coords" : [ 0, 4 ] }, "21" : { "original" : true, "rgb" : { "b" : 221, "g" : 194, "r" : 197 }, "coords" : [ 1, 4 ] }, "22" : { "original" : true, "rgb" : { "b" : 255, "g" : 255, "r" : 255 }, "coords" : [ 2, 4 ] }, "23" : { "original" : true, "rgb" : { "b" : 200, "g" : 200, "r" : 255 }, "coords" : [ 3, 4 ] }, "24" : { "original" : true, "rgb" : { "b" : 1, "g" : 1, "r" : 255 }, "coords" : [ 4, 4 ] } }, "height" : 5, "width" : 5, "__v" : 0, "_parentEvent" : ObjectId("55e65cca3b1c5de4381f9f67") }

  var minimum;
  var whatChunk;

  //_storage will ultimately be replaced with map.data

  for(var key in _storage){

    //check to see if key is in ignoreKeys before executing the block below.
    if (!(key in ignoreKeys)){
      var mainRGB = _storage[key].rgb;
      var RGBDistance = Math.sqrt(Math.pow(mainRGB.r - rgb.r, 2) + Math.pow(mainRGB.g - rgb.g, 2) + Math.pow(mainRGB.b - rgb.b, 2));
      var key = key;
      //the difference between the average RGB value of the small image and the average RGB value of the large image.
      if(minimum === undefined){
        minimum = RGBDistance;
        whatChunk = _storage[key];
      }
      if(RGBDistance < minimum && _storage[key].minValue === undefined){
        minimum = RGBDistance;
        whatChunk = _storage[key];
      }
    }
  }
  

  if (whatChunk.original === true){
    whatChunk.minValue = minimum;
    whatChunk.original = false;
  } 
  // else if (whatChunk.original === false){
  //   if (whatChunk.minValue < minimum){

  //   }
    //if whatChunk.minValue < minimum
      //find another spot for the image; make sure it can't land in this spot again.
    //if whatChunk.minValue > minimum
      //what

    //logic to handle collisions goes here.
    //TODO: give the schema for the map object properties: minValue and imgPath
    //TODO: on page load for the SVG view, iterate through the entire object
    //and call renderImage for each image found.
  // }
  renderImage(whatChunk.coords[0], whatChunk.coords[1]);
}

var renderImage = function(xCoord, yCoord){
  var svgImg = document.createElementNS('http://www.w3.org/2000/svg','image');
  svgImg.setAttributeNS(null,'height','10');
  svgImg.setAttributeNS(null,'width','10');
  svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', img.src);
  svgImg.setAttributeNS(null,'x',placeHolder.coords[0]);
  svgImg.setAttributeNS(null,'y',placeHolder.coords[1]);
  svgImg.setAttributeNS(null, 'visibility', 'visible');

  var svgLink = document.createElementNS('http://www.w3.org/2000/svg', 'a');
  svgLink.setAttributeNS('http://www.w3.org/1999/xlink','href', img.src);
  svgLink.appendChild(svgImg);

  document.getElementsByClassName('svg-pan-zoom_viewport')[0].appendChild(svgLink);
}
