var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider", function ($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../login.html', 
        controller: 'eventsProfileController'
      })
      .when('/events', {
        templateUrl: '../events.html',
        controller: 'eventsProfileController'
      });
      // .otherwise({
      //   //default path is back to the profile page
      //   //the route auth validation will either load the profile view or the login view at '/'
      //   redirectTo: '/login'
      // });
  }]);

tess.run([ '$rootScope', '$location', function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
    //TO DO: check if user is logged in. If not send them to the login page
  });
}]);

// globally available functions that make http requests to the server
tess.factory('httpRequestFactory', [ '$http', function ($http){
  var httpRequestFactory = {};
  httpRequestFactory.madeUserProfileRequest = false;
  httpRequestFactory.getUserProfile = function(){
    console.log('making server request');
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
      httpRequestFactory.fullUserProfile = response;
      httpRequestFactory.madeUserProfileRequest = true;
      return response;
    });
  };
  return httpRequestFactory;
}]);


tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', function ($scope, httpRequestFactory){
  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
        return response;
      });
  };
  $scope.userProfile = httpRequestFactory.fullUserProfile === undefined ? $scope.getUserProfile() : httpRequestFactory.fullUserProfile;
  $scope.joinEvent = function(){
    //TODO: code to join an exisiting event
    console.log('ready to JOIN an event');
  };
  $scope.createEvent = function(){
    //capture entered event code (if any) and send the user to the create event view
    console.log("ready to CREATE a new event");
  };
  $scope.goToExisitingEvent = function(){
    //on clicking an event, take the user to that event mosaic page
    console.log("off to an exisiting event");
  };
}]);

/*tess.controller('tessellCtrl', ['$scope', "eventFactory", "$location", function ($scope, eventFactory, $location){
  $scope.mainMosaicImage = eventFactory.mainMosaicImage;
  $scope.checkForExistingEvent = function(){
    eventFactory.checkForExistingEvent($scope.eventTag);
  };
  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/create', 
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'autoProcessQueue': false,
      init: function(){
        dz = this;
        $('#submit-all').click(function(){
          dz.processQueue();
        });
      }
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // console.log(formData, file, xhr);
        formData.append("eventCode", $scope.eventTag);
      },
      'success': function (file, response) {
        $scope.getMosiacMap = eventFactory.getMosiacMap(response);
        $location.path('/mosaic');
        $scope.$apply();
      }
    }
  };
}]);*/

/*tess.factory('eventFactory', ["$http", function ($http){
  var eventFactory = {};
  eventFactory.mosaicRetrieved = false;
  eventFactory.getMosiacMap = function(response){
    if(eventFactory.mosaicRetrieved === false){
      eventFactory.mainMosaicImage = response;
      eventFactory.mosaicRetrieved = true;
    }
    console.log('in factory');
    return response;
  };
  eventFactory.checkForExistingEvent = function(eventTag){
    $http.post('/event/join', {eventCode: eventTag})
      .then(function(response){
      });
  };
  return eventFactory;
}]);*/


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

/*tess.directive('dropzone', function () {
 return function (scope, element, attrs) {
   var config, dropzone;

   config = scope[attrs.dropzone];
   dropzone = new Dropzone(element[0], config.options);

   angular.forEach(config.eventHandlers, function (handler, event) {
     dropzone.on(event, handler);
   });
 };
});*/