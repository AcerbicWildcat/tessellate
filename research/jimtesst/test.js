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
<<<<<<< HEAD
* it iterates over the image, breaking it into chunks, gets the average
* RGB value for each chunk, and saves it to a global _storage variable.
* @param {object} imgEl - the image to be chunked.
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

var addToSVG = function(img, rgb) {

  var minimum;
  var placeHolder;

  for(var key in _storage){
    var mainRGB = _storage[key].rgb;
    var RGBDistance = Math.sqrt(Math.pow(mainRGB.r - rgb.r, 2) + Math.pow(mainRGB.g - rgb.g, 2) + Math.pow(mainRGB.b - rgb.b, 2));
    if(minimum === undefined){
      minimum = RGBDistance;
      placeHolder = _storage[key];
    }
    if(RGBDistance < minimum && _storage[key].minValue === undefined){
      minimum = RGBDistance;
      placeHolder = _storage[key];
    }
  }
  
  placeHolder.minValue = minimum;
  placeHolder.original = false;

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
