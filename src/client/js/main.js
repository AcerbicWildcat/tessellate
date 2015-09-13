var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider", '$locationProvider', function ($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
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
      });
      /*
      .otherwise route to /events
       */
      // $locationProvider.html5Mode(true);
  }]);

tess.run([ '$rootScope', '$location', function ($rootScope, $location){
}]);

tess.factory('httpRequestFactory', [ '$http', function ($http){
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
    // mainImg.setAttributeNS(null, 'dropzone', 'dropzoneConfig');

    mosaic.appendChild(mainImg);
    mosaicFactory.redrawImages(mosaicData.map);  //iterates through the model we're given.
    // return 'cool beans';
  };

  mosaicFactory.redrawImages = function(map){
    for (var key in map.data){
      //signs into an event or creates an event.
      if (!!key.imagePath){
        console.log(key.imagePath);
        mosaicFactory.renderImage(key.coords[0], key.coords[1], key, key.imgPath, key.thumbnailPath);
      }
    }
  };

  mosaicFactory.renderImage = function(xCoord, yCoord, ID, imgPath, thumbnailPath){
    var svgImg = document.createElementNS('http://www.w3.org/2000/svg','image');
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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

    var minimums = []; //an array of all distances between guestImg.rgb and mainRGB.
    var whatChunk;

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

    console.log(minimums); //to verify the above

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
        console.log(whatChunk);
        break;
      }
    }

    //TODO: make a post request to the server updating the model with the latest data.
    // $http.post('/event/' + eventCode + '/map', { // TOASK: this route doesn't exisit!!!!!!!
    //   key: whatChunk.ID, //map -> eventMap
    //   value: whatChunk //map -> eventMap
    // })
    // .then(function(response){
    //   console.log("map revised!");
    // });

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
  //$scope.image.height = //main image height $obj.event.height; 
  //$scope.image.width = //main imgae width $obj.event.width;
  //$scope.image.path = //cloudinary path to main image $obj.map.path;
  //$scope.event._id = //current event id TOASK: is this mongo _id or eventCode -> both should be unique??
  // $scope.map.data[key].rgb;
  // $scope.map.data

  $scope.dropzoneConfig = {
    'options': {
      // 'url': '/event/' + 
      'url': '/event/' + $scope.currentEvent.event.eventCode + '/image', //ultimately, we need to set this route up on the server.
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'acceptedFiles': 'image/jpeg, image/png',
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log(file);
        // console.log(formData, file, xhr);
        //TODO: modify the below based on the instructions you gave Jon.
        // formData.append("eventCode", $scope.event._id);
      },
      'success': function (file, response) {
        console.log($scope.currentEvent.map);
        mosaicFactory.findImageHome(response, $scope.currentEvent.map, $scope.currentEvent.event.eventCode);
      }
    }
  };
}]);

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.photoLoaded = false;
  $scope.currentEvent = httpRequestFactory.currentEvent || 'cats';
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
      });
  };
  $scope.getUserEvents();
  $scope.joinEvent = function(){
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
    } else {
      $scope.noEventCode = true;
    }
  };
  $scope.createEvent = function(){
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
    } else {
      $scope.noEventCode = true;
    }
  };
  $scope.getEvent = function(eventCode){
    console.log(eventCode);
    httpRequestFactory.getEvent(eventCode)
      .then(function(response){
        console.log(response.data);
        $location.url('/event/' + eventCode);
      });
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
        formData.append("eventCode", $scope.eventCode);
        formData.append("eventName", $scope.eventName);
        // formData.append("eventDate", $scope.eventDate);
      },
      'success': function (file, response) {
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
