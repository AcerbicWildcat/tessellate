var tess = angular.module("tessell", [
  "ngRoute",
  'tessell.mosaic'
]);

tess.config(["$routeProvider", function ($routeProvider){
    $routeProvider
      .when('/main', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl',
        authenticate: true
      })
      .when('/create', {
        templateUrl: '../create.html',
        controller: 'tessellCtrl',
        authenticate: true
      })
      .when('/mosaic', {
        templateUrl: '../mosaic.html', 
        controller: 'mosaicCtrl',
        authenticate: true
      })
      .when('/', {
        templateUrl: '../login.html', 
        controller: 'mainController',
        authenticate: false
      });
  }]);

tess.run(function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
    // console.log("next---> ", next.$$route.authenticate);
    //TO DO: 
    //  assuming function that returns boolean if user is authenticated
    //  if(user authenticated and route requires authentication){
    //    if( next.templateUrl === "login.html"){
    //      
    //    }else {
    //      $location.path("/login");
    //    }
    //  }
  });
});

// globally available functions that make http requests to the server
tess.factory('httpRequestFactory', [ '$http', function ($http){
  //$scope varable for user login information
  //$scope variable for user profile information
  var httpRequestFactory = {};
  httpRequestFactory.loginUser = function(){
    return $http({
      method: 'GET',
      url: '/auth/facebook'
    }).then(function(response){
      console.log('got a response back in factory login: ', response);
      //if they logged in successfully
      //route them to their main user view page
      //return their user id to be used to get their profile page
    });
  };
  httpRequestFactory.getUserProfile = function(userId){
    //take user identification and ask server for their profile
    //if they have one, attach it to the factory scope for retrieval in other views
    //if they do not a default blank one should be returned and that is what is attached to the factory scope
    console.log('got to getUserProfile');
    return $http({
      method: 'GET',
      url: 'awesome/url'//TBD assuming the roure is something like user/:userId?
    }).then(function(response){
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
  //TODO: do I need a globally availabe variable to hold user information?
  $scope.loginUser = function(){
    httpRequestFactory.loginUser()
      .then(function(response){
        console.log('got a response back in controller login: ', response);
      //after they login, find their user id or name and send that to the server to get their profile view
      // $scope.getUserProfile(/*user identification*/);
      $scope.getUserProfile(/*user identification*/);
    });
  };
  $scope.getUserProfile = function(/*user identification*/){
    httpRequestFactory.getUserProfile(/*user identification*/)
      .then(function(response){

      });
  };
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





/*tess.controller("tessellCtrl", function ($scope, $location){
  $scope.testing = false;
  $scope.eventTag = "";
  $scope.go = function (event){
    if($scope.eventTag === "" && event.keyCode === 13){
      $scope.testing = true;
    }
    else if(event.keyCode === 13){
      // console.log($scope.eventTag);
      $scope.eventTag = "";
      $scope.testing = false;
    }
    // $location.path( path );
  };
});*/

/*tess.controller('DatepickerDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $scope.status.opened = true;
  };*/