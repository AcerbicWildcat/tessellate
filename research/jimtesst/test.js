var _storage = {}
var index = 0;

var canvas = document.getElementById('picture')
// console.log(canvas);
var context = canvas.getContext('2d');

var img = new Image();
img.src = "./mountain.jpg"
img.onload = function(){
  context.drawImage(img, 0, 0);
  chunker(img)
}

/*get average rgb of img*/
function getAverageColor(img) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = img.naturalWidth;
  var height = canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(0, 0, width, height);
  var data = imageData.data;
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

function getAverageChunkColor(data) {
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



var chunker = function(imgEl) {

    //imgEl: the image that gets passed in to the function.
    
    var canvas = document.getElementById("picture");
    var context = canvas.getContext && canvas.getContext('2d'); //look into what these do.
    var width, height;
    var length;
    var segments = {}; //an object that will hold all the chunks and average rgb value for each chunk in the future.
    var count = 0;
            
    var chunk;

    context.drawImage(imgEl, 0, 0); //draws an image to the canvas.

     // canvCon.strokeRect(j, i, 20, 20);
    var pixelSize = 10;
    for (var i = 0; i < imgEl.height; i+=pixelSize){
      for (var j = 0; j < imgEl.width; j+=pixelSize){
        chunk = context.getImageData(j, i, pixelSize, pixelSize);  //format: x offset, y offset, width, height
        // console.log(getAverageChunkColor(chunk.data));
        _storage[index++] = {
          rgb: getAverageChunkColor(chunk.data),
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
    var rgb = getAverageColor(img);
    // var rgbStr = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    // var box = element.querySelector('.box');
    // box.style.backgroundColor = rgbStr;
    // element.querySelector('.rgb').textContent = rgbStr;
    addToMainCanvas(img, rgb);
  /*  _storage[index++] = {
      file: file,
      rgb: [rgb.r, rgb.g, rgb.b],
      // yuv: [yuv.y, yuv.u, yuv.v]
    };
    if(index > 1){
      //find euclidean distance from main image
      var m = _storage[0];
      var c = _storage[index-1];
      var RGBDistance = Math.sqrt(Math.pow(m.rgb[0] - c.rgb[0], 2) + Math.pow(m.rgb[1] - c.rgb[1], 2) + Math.pow(m.rgb[2] - c.rgb[2], 2));
      c.RGBscore = RGBDistance;
      // var YUVDistance = Math.sqrt(Math.pow(m.yuv[0] - c.yuv[0], 2) + Math.pow(m.yuv[1] - c.yuv[1], 2) + Math.pow(m.yuv[2] - c.yuv[2], 2));
      // c.YUVscore = YUVDistance;
      console.log('RGB: ' + RGBDistance);
    }*/
  };

  // document.getElementById('images').appendChild(element);
}


function addToMainCanvas (img, rgb) {
  var canvas = document.getElementById("picture").getContext("2d");
  // .drawImage(img, 0, 0, 5, 5);
  var minimum;
  var placeHolder;
  // var location;
  /*_storage[index++] = {
    rgb: getAverageChunkColor(chunk.data), //{r:r, g:g, b:b}
    coords: [j, i],
    original: true
  }*/
  for(var key in _storage){
    var mainRGB = _storage[key].rgb;
    var RGBDistance = Math.sqrt(Math.pow(mainRGB.r - rgb.r, 2) + Math.pow(mainRGB.g - rgb.g, 2) + Math.pow(mainRGB.b - rgb.b, 2));
    if(minimum === undefined){
      minimum = RGBDistance;
      placeHolder = _storage[key];
    }
    if(RGBDistance < minimum && _storage[key].minValue === undefined){
      // console.log("changed minimum " + RGBDistance + "    " + minimum);
      minimum = RGBDistance;
      placeHolder = _storage[key];
      // location = key;
    }
  }
  placeHolder.minValue = minimum;
  // console.log(placeHolder);
  // console.log(img);
  canvas.drawImage(img, placeHolder.coords[0], placeHolder.coords[1], 10, 10);

  var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
  svgimg.setAttributeNS(null,'height','10');
  svgimg.setAttributeNS(null,'width','10');
  svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', img.src);
  svgimg.setAttributeNS(null,'x',placeHolder.coords[0]);
  svgimg.setAttributeNS(null,'y',placeHolder.coords[1]);
  svgimg.setAttributeNS(null, 'visibility', 'visible');
  document.getElementById('mainSVG').appendChild(svgimg);

}
