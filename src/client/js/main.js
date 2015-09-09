var tess = angular.module("tessell", [
  "ngRoute",
  'tessell.mosaic'
]);

tess.config(["$routeProvider", function ($routeProvider){
    $routeProvider
/*      .when('/', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl',
        authenticate: true
      })*/
/*      .when('/create', {
        templateUrl: '../create.html',
        controller: 'tessellCtrl',
        authenticate: true
      })*/
/*      .when('/mosaic', {
        templateUrl: '../mosaic.html', 
        controller: 'mosaicCtrl',
        authenticate: true
      })*/
      .when('/', {
        templateUrl: '../login.html', 
        controller: 'mainController',
        authenticate: false
      });
/*      .otherwise({
        //default path is back to the profile page
        //the route auth validation will either load the profile view or the login view at '/'
        redirectTo: '/login'
      });*/
  }]);

tess.run(function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
    console.log("next---> ", next.$$route.authenticate);
    //TO DO:
    //if user is not authenticated
    //  redirect to the login view
    //  $location.path('/');
    //  $scope.$apply();
  });
});

// globally available functions that make http requests to the server
tess.factory('httpRequestFactory', [ '$http', function ($http){
  //$scope varable for user login information
  //$scope variable for user profile information
  //maybe cal it $scope.userObject
  var httpRequestFactory = {};
  httpRequestFactory.getUserProfile = function(){
    //take user identification and ask server for their profile
    //if they have one, attach it to the factory scope for retrieval in other views
    //if they do not a default blank one should be returned and that is what is attached to the factory scope
    console.log('got to getUserProfile');
    return $http({
      method: 'GET',
      url: 'user/facebook'//TBD assuming the roure is something like user/:userId?
    }).then(function(response){
      console.log("response from request factory --> ", response);
      //user profile information should be attached to this
      //expecting events they either have created or are a part of
      //expecting user display name
      //expectine user profile picture
      //set this information to the factory scope so we can grab it from any view we made need it for
    });
  };
  return httpRequestFactory;
}]);

tess.controller('mainController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
        console.log("response from main controller --> ", response);
      });
  };
  //TODO: do I need a globally availabe variable to hold user information?
  // $scope.loginUser = function(){
  //   httpRequestFactory.loginUser()
  //     .then(function(response){
  //       console.log('got a response back in controller login: ', response);
  //       $location.path('/profile');
  //       //maybe need this $apply method to load new path. Check on that notion.
  //       // $scope.$apply();
  //     //after they login, find their user id or name and send that to the server to get their profile view
  //     // $scope.getUserProfile(/*user identification*/);
  //     // $scope.getUserProfile(/*user identification*/);
  //   });
  // };
}]);

tess.controller('tessellCtrl', ['$scope', "eventFactory", "$location", function ($scope, eventFactory, $location){
  // $scope.eventTag = "";
  // console.log('loaded Ctrl: ', $scope.mainMosaicImage);
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
}]);

tess.factory('eventFactory', ["$http", function ($http){
  var eventFactory = {};
  eventFactory.mosaicRetrieved = false;
  eventFactory.getMosiacMap = function(response){
    // console.log(response);
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
        // console.log(response);
      });
    // console.log('handling the event checking for', eventTag);
  };
  return eventFactory;
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

   // create a Dropzone for the element with the given options
   dropzone = new Dropzone(element[0], config.options);

   // bind the given event handlers
   angular.forEach(config.eventHandlers, function (handler, event) {
     dropzone.on(event, handler);
   });
 };
});