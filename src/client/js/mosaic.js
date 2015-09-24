tess.factory('mosaicFactory', ['httpRequestFactory', '$q', function (httpRequestFactory, $q){
  var mosaicFactory = {};

  mosaicFactory.startMosaic = function(mosaicData){
    var mosaic = document.getElementById('mosaic');
    mosaic.setAttributeNS(null, 'height', mosaicData.map.height.toString());
    mosaic.setAttributeNS(null, 'width', mosaicData.map.width.toString());
    var mainImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    mainImg.setAttributeNS(null, 'height', mosaicData.map.height.toString());
    mainImg.setAttributeNS(null, 'width', mosaicData.map.width.toString());
    mainImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', mosaicData.image.imgPath);
    mainImg.setAttributeNS(null, 'x', 0);
    mainImg.setAttributeNS(null, 'y', 0);
    mainImg.setAttributeNS(null, 'visibility', 'visible');

    mosaic.appendChild(mainImg);
    mosaicFactory.redrawImages(mosaicData.map);
  };

  mosaicFactory.redrawImages = function(map){
    for (var key in map.data){
      if (map.data[key].thumbnailPath){
        mosaicFactory.renderImage(map.data[key].coords[0], map.data[key].coords[1], key, map.data[key].imgPath, map.data[key].thumbnailPath);
      }
    }
  };

  mosaicFactory.renderImage = function(xCoord, yCoord, ID, imgPath, thumbnailPath){
    
      var svgImg = document.createElementNS('http://www.w3.org/2000/svg','image');
      svgImg.setAttributeNS(null,'height','10');
      svgImg.setAttributeNS(null,'width','10');
      svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', thumbnailPath);
      svgImg.setAttributeNS(null,'x', xCoord);
      svgImg.setAttributeNS(null,'y', yCoord);
      svgImg.setAttributeNS(null, 'visibility', 'visible');

      var svgLink = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      svgLink.setAttributeNS('http://www.w3.org/1999/xlink','href', imgPath);
      svgLink.setAttributeNS(null,'id','image'+ID);
      svgLink.appendChild(svgImg);

      document.getElementById('mosaic').appendChild(svgLink);
  };

  mosaicFactory.deleteImage = function(ID){
    var removeLink = document.getElementById('image' + ID);
    document.getElementById('mosaic').removeChild(removeLink);
  };

  return mosaicFactory;

}]);

tess.controller('mosaicCtrl', ['$scope', 'mosaicFactory', 'httpRequestFactory', '$location', function ($scope, mosaicFactory, httpRequestFactory, $location){
  $scope.currentEvent = httpRequestFactory.currentEvent;
  if($scope.currentEvent === undefined){
    $location.url('/events');
  }
  $scope.nextPosition = [];
  $scope.loaded = true;
  $scope.startMosaic = function(mosaicData){
    mosaicFactory.startMosaic(mosaicData);
  };
  $scope.startMosaic($scope.currentEvent);

  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/' + $scope.currentEvent.event.eventCode + '/image',
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      // 'autoProcessQueue': false,
      'acceptedFiles': 'image/jpeg, image/png',
    },
    'eventHandlers': {
/*      'sending': function (file, xhr, formData) {
      },*/
      'success': function (file, response) {
        this.removeAllFiles();
        $('div.dz-success').remove();
        mosaicFactory.redrawImages(response);
        $scope.loaded = true;
        $scope.$apply();
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      },
      'addedfile': function(file){
        $scope.loaded = false;
        $scope.$apply();
      }
    }
  };
  $scope.logout = function (){
    httpRequestFactory.logout()
      .then(function(response){
        $location.url('/');
      });
  };
}]);