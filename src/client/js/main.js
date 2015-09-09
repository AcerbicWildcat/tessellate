var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider", function ($routeProvider){
    $routeProvider
<<<<<<< HEAD
      .when('/', {
        templateUrl: '../events.html', 
        controller: 'eventsProfileController'
=======
      .when('/main', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl',
        authenticate: true
      })
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
      })
      .otherwise({
        //default path is back to the profile page
        //the route auth validation will either load the profile view or the login view at '/'
        redirectTo: '/'
>>>>>>> turned on auth module in server and set default route on bad url
      });
      /*.when('/events', {
        templateUrl: '../events.html',
        controller: 'eventsProfileController'
      });*/
  }]);

tess.run([ '$rootScope', '$location', function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
<<<<<<< HEAD

=======
    console.log("next---> ", next.$$route.authenticate);
    //TO DO:
    //if user is not authenticated
    //  redirect to the login view
    //  $location.path('/');
    //  $scope.$apply();
>>>>>>> turned on auth module in server and set default route on bad url
  });
}]);

// globally available functions that make http requests to the server
tess.factory('httpRequestFactory', [ '$http', function ($http){
<<<<<<< HEAD
=======
  //$scope varable for user login information
  //$scope variable for user profile information
  //maybe cal it $scope.userObject
>>>>>>> turned on auth module in server and set default route on bad url
  var httpRequestFactory = {};
  httpRequestFactory.madeUserProfileRequest = false;
  httpRequestFactory.getUserProfile = function(){
    console.log('making server request');
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
<<<<<<< HEAD
      httpRequestFactory.fullUserProfile = response;
      httpRequestFactory.madeUserProfileRequest = true;
      return response;
=======
      console.log('got a response back in factory login: ', response);
      httpRequestFactory.userPofile = response;
      //set $scope.userObject to the response for global app usage
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
>>>>>>> turned on auth module in server and set default route on bad url
    });
  };
  return httpRequestFactory;
}]);

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', function ($scope, httpRequestFactory){
  $scope.noEvent = false;
  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
<<<<<<< HEAD
        return response;
      });
  };
  $scope.userProfile = httpRequestFactory.fullUserProfile === undefined ? $scope.getUserProfile() : httpRequestFactory.fullUserProfile;
  $scope.joinEvent = function(){
    //TODO: code to join an exisiting event
    if(!!$scope.eventCode){
      $scope.noEvent = false;
      console.log('ready to JOIN an event ', $scope.eventCode);
    } else {
      $scope.noEvent = true;
    }
  };
  $scope.createEvent = function(){
      console.log("ready to CREATE a new event ", $scope.eventCode);
  };
  $scope.goToExisitingEvent = function(){
    //on clicking an event, take the user to that event mosaic page
    console.log("off to an exisiting event");
    };
=======
        console.log('got a response back in controller login: ', response);
        $location.path('/profile');
        //maybe need this $apply method to load new path. Check on that notion.
        // $scope.$apply();
      //after they login, find their user id or name and send that to the server to get their profile view
      // $scope.getUserProfile(/*user identification*/);
      // $scope.getUserProfile(/*user identification*/);
    });
  };
>>>>>>> turned on auth module in server and set default route on bad url
}]);

/*tess.controller('tessellCtrl', ['$scope', "eventFactory", "$location", function ($scope, eventFactory, $location){
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
<<<<<<< HEAD
});*/
=======
});
>>>>>>> turned on auth module in server and set default route on bad url
