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
      // .when('/create', {
      //   templateUrl: '../create.html', 
      //   controller: 'eventsProfileController'
      // })
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
      console.log('currentEvent: ', response.data);
      return response;
    });
  };
  httpRequestFactory.joinEvent = function(eventCode){
    return $http({
      method: 'POST',
      url: '/events/' + eventCode,
    }).then(function(response){
      // console.log('finished post join event');
      return response;
    });
  };
  httpRequestFactory.updateMap = function(segmentsToUpdate, eventCode){
    return $http({
      method: 'POST',
      url: '/events/' + eventCode + '/map',
      data: {
        segmentsToUpdate: segmentsToUpdate,
        eventCode: eventCode
      }
    }).then(function(response){
      // console.log("response from post request ",response);
      return response;
    });
  };
  httpRequestFactory.logout = function(){
    console.log('inside logout factory');
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function (response){
      console.log("LOGGED OUT! ", response);
      return response;
    });
  };
  return httpRequestFactory;
}]);


tess.factory('mosaicFactory', ['httpRequestFactory', function (httpRequestFactory){
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
      if (map.data[key].thumbnailPath){
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
  mosaicFactory.deleteImage = function(ID){
    var removeLink = document.getElementById('image' + ID);
    document.getElementById('mosaic').removeChild(removeLink);
  };

  mosaicFactory.findImageHome = function(guestImages, map, eventCode, nextPosition){
    var segmentsToUpdate = [];
    for (var i = guestImages.length-1; i >= 0; i--){

      var segmentToUpdate = nextPosition[i].value;
      segmentToUpdate.imgPath = guestImages[i].imgPath;
      segmentToUpdate.thumbnailPath = guestImages[i].thumbnailPath;
      segmentToUpdate.ID = nextPosition[i].key;

      segmentsToUpdate.push(segmentToUpdate);
    }
    httpRequestFactory.updateMap(segmentsToUpdate, eventCode);
    
    for (var j = guestImages.length-1; j >= 0; j--){
      mosaicFactory.renderImage(segmentsToUpdate[j].coords[0], segmentsToUpdate[j].coords[1], segmentsToUpdate[j].ID, segmentsToUpdate[j].imgPath, segmentsToUpdate[j].thumbnailPath);
    }

  };

  return mosaicFactory;

}]);

tess.controller('mosaicCtrl', ['$scope', 'mosaicFactory', 'httpRequestFactory', '$location', function ($scope, mosaicFactory, httpRequestFactory, $location){
  $scope.nextPosition = [];
  $scope.currentEvent = httpRequestFactory.currentEvent;
  $scope.waitingForUpload = true;
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
      'sending': function (file, xhr, formData) {
        var RGBObject = ($scope.currentEvent.map.unfilledKeys);
        // $scope.nextPosition = RGBObject.pop();
        $scope.nextPosition = RGBObject.splice(-5, 5);
        // will now be passing an array of RGB objects (group of 25 from end of queue)
        // will need to iterate through and pass to cloudinary to tint and return
        // formData.append("destinationRGB", JSON.stringify($scope.nextPosition.value.originalRGB));
        formData.append("destinationRGB", JSON.stringify($scope.nextPosition));
        $scope.$apply();
      },
      'success': function (file, response) {
        $('div.dz-success').remove();
        mosaicFactory.findImageHome(response, $scope.currentEvent.map, $scope.currentEvent.event.eventCode, $scope.nextPosition);
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      },
      'addedfile': function(file){
        // $scope.waitingForUpload = false;
        // $scope.$apply();
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

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.createdEvents = [];
  $scope.joinedEvents = [];
  $scope.hasCreated = false;
  $scope.hasJoined = false;
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
        for(var i=0; i<response.data.events.length; i++){
          if(response.data._id === response.data.events[i]._creator){
            $scope.hasCreated = true;
            $scope.createdEvents.push(response.data.events[i]);
          }else{
            $scope.hasJoined = true;
            $scope.joinedEvents.push(response.data.events[i]);
          }
        }
        console.log($scope.userEvents._id);
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
    httpRequestFactory.getEvent(eventCode)
      .then(function(response){
        $location.url('/event/' + eventCode);
      });
  };

  $scope.logout = function (){
    console.log('clicked logout');
    httpRequestFactory.logout()
      .then(function(response){
        $location.url('/');
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
      },
      'success': function (file, response) {
        // console.log('success call ', $scope.eventCode);
        $scope.loaded = true;
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
  $scope.loaded = true;
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
