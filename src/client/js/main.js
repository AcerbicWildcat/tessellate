
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
        controller: 'tessellCtrl',
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