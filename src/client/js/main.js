/**
 * tess is the main angular module.
 * @type {angular module}
 */
var tess = angular.module("tessell", [
  "ngRoute"
  // "flow",
  // 'authServices'
])
  // uncomment code below to add auth checks on protected resources
  // .config(function ($routeProvider, $httpProvider, ResInterceptor, AuthCheck){
  .config(function ($routeProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl'
      })
      .when('/create', {
        templateUrl: '../create.html',
        controller: 'tessellCtrl',
        // resolve: {
        //   loggedin: 'AuthCheck.checkLoggedIn'
        // }
      })
      .when('/mosaic', {
        templateUrl: '../mosaic.html', 
        controller: 'tessellCtrl',
        // resolve: {
        //   loggedin: 'AuthCheck.checkLoggedIn'
        // }
      });
    // may not actually need this interceptor in addition to the resolves above
    // $httpProvider.interceptors.push('ResInterceptor');
  });

//   .config(['flowFactoryProvider', function (flowFactoryProvider) {
//     flowFactoryProvider.defaults = {
//       // target: 'upload.php',
//       permanentErrors: [404, 500, 501],
//       maxChunkRetries: 1,
//       chunkRetryInterval: 5000,
//       simultaneousUploads: 4,
//       singleFile: true
//     };
//     flowFactoryProvider.on('fileAdded', function (event) {
//       console.log('fileAdded', arguments);
//     });
//     // Can be used with different implementations of Flow.js
//     // flowFactoryProvider.factory = fustyFlowFactory;
// }]);

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

tess.controller('tessellCtrl', ['$scope', "eventFactory", "$location", "$window", function ($scope, eventFactory, $location, $window){
  // $scope.eventTag = "";
  $scope.checkForExistingEvent = function(){
    eventFactory.checkForExistingEvent($scope.eventTag);
  };
  $scope.dropzoneConfig = {
    'options': {
      'url': '/event/create', 
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // console.log(formData, file, xhr);
        formData.append("eventCode", $scope.eventTag);
      },
      'success': function (file, response) {
        // console.log(response);
        console.log('done with sending photo');
        // $location.url('/mosaic');
        $scope.thingy = eventFactory.thingy(response);
        console.log($scope.thingy);
        $window.location.href = '/#/mosaic';
      }
    }
  };
}]);

tess.factory('eventFactory', ["$http", function ($http){
var eventFactory = {};
eventFactory.thingy = function(response){
  // console.log(response);
  console.log('in factory');
  return response;
};
eventFactory.checkForExistingEvent = function(eventTag){
  $http.post('/event/join', {eventCode: eventTag})
    .then(function(response){
      console.log(response);
    });
  console.log('handling the event checking for', eventTag);
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