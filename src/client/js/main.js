/**
 * tess is the main angular module.
 * @type {angular module}
 */
var tess = angular.module("tessell", [
  "ngRoute",
  "flow"
])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl'
      })
      .when('/create', {
        templateUrl: '../create.html',
        controller: 'DatepickerDemoCtrl'
      })
      .when('/mosaic', {
        templateUrl: '../mosaic.html', 
        controller: 'tessellCtrl'
      });
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

tess.controller("tessellCtrl", function ($scope, $location){
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
      $location.path('/mosaic');
    }
    // $location.path( '#/mosaic' );
  };
});

tess.controller('DatepickerDemoCtrl', function ($scope) {
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
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  // $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});

// var app = angular.module('app', ['flow'])
// .config(['flowFactoryProvider', function (flowFactoryProvider) {
//   flowFactoryProvider.defaults = {
//     // target: 'upload.php',
//     permanentErrors: [404, 500, 501],
//     maxChunkRetries: 1,
//     chunkRetryInterval: 5000,
//     simultaneousUploads: 4,
//     singleFile: true
//   };
//   flowFactoryProvider.on('catchAll', function (event) {
//     console.log('catchAll', arguments);
//   });
//   // Can be used with different implementations of Flow.js
//   // flowFactoryProvider.factory = fustyFlowFactory;
// }]);