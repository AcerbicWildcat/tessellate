var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider", '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../login.html',
        controller: 'landingController'
      })
      .when('/events', {
        templateUrl: '../events.html', 
        controller: 'eventsProfileController'
      })
      .when('/create', {
        templateUrl: '../create.html', 
        controller: 'eventsProfileController'
      })
      .when('/event/:eventcode', {/*eventually /mosaic/:eventId*/
        templateUrl: '../mosaic.html',
        controller: 'mosaicCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $httpProvider.interceptors.push('InterceptResponse');
  }]);

tess.run([ '$rootScope', '$location', function ($rootScope, $location){
}]);

tess.factory('InterceptResponse', ['$q', '$location', function ($q, $location){
  return {
    responseError: function (response){
      if (response.status === 401){
        $location.url('/');
        return $q.reject(response);
      }
    }
  };
}]);

tess.factory('httpRequestFactory', [ '$http', '$location', '$q', function ($http, $location, $q){
  var httpRequestFactory = {};
  httpRequestFactory.getUserProfile = function(){
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
      httpRequestFactory.fullUserProfile = response.data;
      return response;
    });
  };
  httpRequestFactory.getUserEvents = function(){
    return $http({
      method: 'GET',
      url: '/events'
    }).then(function(response){
      httpRequestFactory.userEvents = response.data;
      return response;
    });
  };
  httpRequestFactory.getEvent = function(eventCode){
    return $http({
      method: 'GET',
      url:'/events/'+ eventCode
    }).then(function(response){
      httpRequestFactory.currentEvent = response.data;
      return response;
    });
  };
  httpRequestFactory.joinEvent = function(eventCode){
    return $http({
      method: 'POST',
      url: '/events/' + eventCode,
    }).then(function(response){
      console.log('finished post join event');
      return response;
    });
  };
  httpRequestFactory.logout = function(){
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function (res){
      console.log("LOGGED OUT!");
      return res;
    });
  };
  return httpRequestFactory;
}]);


tess.factory('mosaicFactory', ['$http', function ($http){
  var mosaicFactory = {};

  mosaicFactory.startMosaic = function(mosaicData){
    var mosaic = document.getElementById('mosaic');
    mosaic.setAttributeNS(null, 'height', mosaicData.map.height.toString());
    mosaic.setAttributeNS(null, 'width', mosaicData.map.width.toString());
    var mainImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    mainImg.setAttributeNS(null, 'height', mosaicData.map.height.toString()); // mainImg -> image
    mainImg.setAttributeNS(null, 'width', mosaicData.map.width.toString()); //mainImg -> image
    mainImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', mosaicData.image.imgPath); //the path to cloudinary mainImg -> image
    mainImg.setAttributeNS(null, 'x', 0);
    mainImg.setAttributeNS(null, 'y', 0);
    mainImg.setAttributeNS(null, 'visibility', 'visible');

    mosaic.appendChild(mainImg);
    mosaicFactory.redrawImages(mosaicData.map);
  };

  mosaicFactory.redrawImages = function(map){
    for (var key in map.data){
      if (map.data[key].imgPath){
        mosaicFactory.renderImage(map.data[key].coords[0], map.data[key].coords[1], key, map.data[key].imgPath, map.data[key].thumbnailPath);
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

    // document.getElementsByClassName('svg-pan-zoom_viewport')[0].appendChild(svgLink);
    document.getElementById('mosaic').appendChild(svgLink);
    //for the above to append, the pan-zoom code snippet needs to have run...
  };

  //we won't have to use this until we start handling collisions.
/*  mosaicFactory.deleteImage = function(ID){
    var removeLink = document.getElementById('image' + ID);
    document.getElementsByClassName('svg-pan-zoom_viewport')[0].removeChild(removeLink);
  };*/

  mosaicFactory.findImageHome = function(guestImg, map, eventCode){
    console.log('findImageHome');
    var minimums = []; //an array of all distances between guestImg.rgb and mainRGB.
    var whatChunk;

/*    var index = index || 0;
    var placedNewImage = false;*/
    /*
    while we haven't placed the image AND we are still within bounds of the mosaic image
    go through each sector.
     */
/*    while(placedNewImage === false && index < Object.keys(map.data).length){
      //if there is no image currently there place the guestImg in that position
      if(!map.data[index].hasOwnProperty('imgPath')){
        map.data[index].original = false;
        // map.data[index].minvalue = ???; // need to calculate the current min value
        // need to store both the original image rgb AND the current image rgb
        map.data[index].imgPath = guestImg.imgPath;
        map.data[index].thumbnailPath = guestImg.thumbnailPath;
        replacedSector = map.data[index];
        replacedSector.ID = index;
        placedNewImage = true;
      }else{
        var mainRGB = map.data[index].rgb; //map -> eventMap
        var CurrentImageRGBDistance = Math.sqrt(Math.pow(mainRGB.r - guestImg.rgb.r, 2) + Math.pow(mainRGB.g - guestImg.rgb.g, 2) + Math.pow(mainRGB.b - guestImg.rgb.b, 2));
        var PotentialImageRGBDistance = Math.sqrt(Math.pow(mainRGB.r - guestImg.rgb.r, 2) + Math.pow(mainRGB.g - guestImg.rgb.g, 2) + Math.pow(mainRGB.b - guestImg.rgb.b, 2));
        
        if()
      }
    }*/

    for(var key in map.data){ //map -> eventMap

      var mainRGB = map.data[key].rgb; //map -> eventMap
      var RGBDistance = Math.sqrt(Math.pow(mainRGB.r - guestImg.rgb.r, 2) + Math.pow(mainRGB.g - guestImg.rgb.g, 2) + Math.pow(mainRGB.b - guestImg.rgb.b, 2));
      //the difference between the average RGB value of the small image and the average RGB value of the large image.

      minimums.push({
        key: key,
        min: RGBDistance
      });
    }

    //sort the minimums so that the lowest difference is first.
    minimums.sort(function(a, b){
      return (a.min - b.min);
    });


    //now, iterate through the minimums and check each key in $scope.map.data for whether it has a minValue
    for (var i = 0; i < minimums.length; i++){
      if (map.data[minimums[i].key].original === false){//map -> eventMap
        continue;
        //right now, we're just skipping over sector that has an image in it.
      } else {
        //updates the data.
        map.data[minimums[i].key].original = false;//map -> eventMap
        map.data[minimums[i].key].minValue = minimums[i].min;//map -> eventMap
        map.data[minimums[i].key].imgPath = guestImg.imgPath;//map -> eventMap
        map.data[minimums[i].key].thumbnailPath = guestImg.thumbnailPath;//map -> eventMap
        whatChunk = map.data[minimums[i].key];//map -> eventMap
        whatChunk.ID = minimums[i].key;
        // console.log(whatChunk);
        break;
      }
    }

    $http.post('/event/' + eventCode + '/map', { 
      //QUESTION: Why do we need whatChunk.ID if we are already passing over whatChunk?
      //TO DO: whatChunk is NOT a descriptive variable name....rename for documentation and clarity
      key: whatChunk.ID,
      value: whatChunk,
      eventCode: eventCode
    })
    .then(function(response){
      console.log("map revised!-->", response);
    });

    mosaicFactory.renderImage(whatChunk.coords[0], whatChunk.coords[1], whatChunk.ID, guestImg.imgPath, guestImg.thumbnailPath);
    //xCoord, yCoord, ID, imgPath, thumbnailPath
    //eventually, when we revise this function to handle collisions, we'll want to invoke mosaicFactory.redrawImages.
  };

  return mosaicFactory;

}]);

tess.controller('mosaicCtrl', ['$scope', 'mosaicFactory', 'httpRequestFactory', function ($scope, mosaicFactory, httpRequestFactory){
  $scope.currentEvent = httpRequestFactory.currentEvent;
  $scope.startMosaic = function(mosaicData){
    mosaicFactory.startMosaic(mosaicData);
  };
  $scope.startMosaic($scope.currentEvent);

  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/' + $scope.currentEvent.event.eventCode + '/image', //ultimately, we need to set this route up on the server.
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'acceptedFiles': 'image/jpeg, image/png',
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('file sent');
        //TODO: modify the below based on the instructions you gave Jon.
        // formData.append("eventCode", $scope.event._id);
      },
      'success': function (file, response) {
        console.log('file returned success');
        mosaicFactory.findImageHome(response, $scope.currentEvent.map, $scope.currentEvent.event.eventCode);
      }
    }
  };
}]);

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.photoLoaded = false;

  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
        $scope.userProfile = response.data;
      });
  };
  $scope.getUserEvents = function(){
    console.log('getting events');
    httpRequestFactory.getUserEvents()
      .then(function(response){
        $scope.userEvents = response.data;
        console.log(response.data.events);
      });
  };
  $scope.joinEvent = function(eventCode){
    if(!eventCode){
      console.log(eventCode);
      $scope.noEventCode = true;
    } else {
      console.log("trying to join ", eventCode);
      $scope.noEventCode = false;
      httpRequestFactory.joinEvent(eventCode)
        .then(function(response){
          // console.log(response);
          $scope.getEvent(eventCode);
        });
    }
  };
  $scope.createEvent = function(eventCode){
  };
  $scope.getEvent = function(eventCode){
    // console.log(eventCode);
    httpRequestFactory.getEvent(eventCode)
      .then(function(response){
        console.log(response.data);
        $location.url('/event/' + eventCode);
      });
  };

  $scope.logout = function (){
    httpRequestFactory.logout();
  };

  $scope.dropzoneConfig = {
    'options': {
      'url': '/event',
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'autoProcessQueue': false,
      'acceptedFiles': 'image/jpeg, image/png',
      init: function(){
        dz = this;
        $('#submit-all').click(function(){
          if(!!$scope.eventCode && !!$scope.eventName && !!$scope.eventDate && dz.files.length === 1){
            dz.processQueue();
            dz.removeAllFiles();
          }
        });
      }
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // console.log('sending file');
        formData.append("eventCode", $scope.eventCode);
        formData.append("eventName", $scope.eventName);
        // formData.append("eventDate", $scope.eventDate);
      },
      'success': function (file, response) {
        // console.log('success call ', $scope.eventCode);
        $scope.getEvent($scope.eventCode);
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      },
      'addedfile': function(file){
        // $scope.$broadcast('photoUploaded');
      }
    }
  };
  $scope.getUserEvents();

  $scope.$on('redraw', function (newMosaicData){
    console.log('trying to redraw');
    mosaicFactory.redrawImages(newMosaicData);
  });

  $scope.currentEvent = httpRequestFactory.currentEvent;

}]);

tess.controller('landingController', ['$scope', function ($scope){

}]);

/**
* An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
* 
* Usage:
* 
* <div ng-app="app" ng-controller="SomeCtrl">
*   <button dropzone="dropzoneConfig">
*     Drag and drop files here or click to upload
*   </button>
* </div>
*/

tess.directive('dropzone', function () {
 return function (scope, element, attrs) {
   var config, dropzone;

   config = scope[attrs.dropzone];
   dropzone = new Dropzone(element[0], config.options);

   angular.forEach(config.eventHandlers, function (handler, event) {
     dropzone.on(event, handler);
   });
 };
});
