var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider",'$httpProvider', function ($routeProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../events.html', 
        controller: 'eventsProfileController'
      })
      .when('/create', {
        templateUrl: '../create.html', 
        controller: 'eventsProfileController'
      })
      .when('/mosaic', {
        templateUrl: '../mosaic.html',
        controller: 'eventsProfileController'
      });
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
