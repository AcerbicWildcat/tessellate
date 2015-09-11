var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider", function ($routeProvider){
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
  $rootScope.$on("$routeChangeStart", function (event, next, current){
  });
}]);

// globally available functions that make http requests to the server
tess.factory('httpRequestFactory', [ '$http', function ($http){
  var httpRequestFactory = {};
  // httpRequestFactory.madeUserProfileRequest = false;
  httpRequestFactory.getUserProfile = function(){
    // console.log('making server request');
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
      httpRequestFactory.fullUserProfile = response.data;
      // httpRequestFactory.madeUserProfileRequest = true;
      return response;
    });
  };
  return httpRequestFactory;
}]);

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  // console.log($scope.minDate);
  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
        // console.log(response.data);
        $scope.userProfile = response.data;
        // return response;
      });
  };
  // $scope.userProfile = httpRequestFactory.fullUserProfile;// === undefined ? $scope.getUserProfile() : httpRequestFactory.fullUserProfile;
  $scope.joinEvent = function(){
    //TODO: code to join an exisiting event
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
      // console.log('ready to JOIN an event ', $scope.eventCode);
    } else {
      $scope.noEventCode = true;
    }
  };
  $scope.createEvent = function(){
    // $location.url('/create');
    // console.log("ready to CREATE a new event ", $scope.eventCode);
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
      // console.log('ready to create new event ', $scope.eventCode);
    } else {
      // console.log('no event code');
      $scope.noEventCode = true;
    }
  };
  $scope.goToExisitingEvent = function(eventCode){
    //on clicking an event, take the user to that event mosaic page
    console.log("off to an exisiting event: ", eventCode);
    $location.url('/mosaic');
    };
  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/create', 
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'autoProcessQueue': false,
      'acceptedFiles': 'image/jpeg, image/png',
      init: function(){
        $scope.photoTest = true;
        dz = this;
        $('#submit-all').click(function(){
          // console.log('click');
          if(!!$scope.eventCode && !!$scope.eventName && !!$scope.date && dz.files.length === 1){
            // console.log('processing photo');
            dz.processQueue();
          }
        });
      }
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // console.log(formData, file, xhr);
        formData.append("eventCode", $scope.eventTag);
      },
      'success': function (file, response) {
        console.log('yeah, it uploaded');
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      },
      'addedfile': function(){
        $scope.photoTest = false;
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
