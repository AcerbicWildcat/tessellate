/**
 * tess is the main angular module.
 * @type {angular module}
 */
var tess = angular.module("tessell", [
  "ngRoute"
])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../main.html',
        controller: 'tessellCtrl'
      })
      .when('/create', {
        templateUrl: '../create.html',
        controller: 'tessellCtrl'
      })
      .when('/mosaic', {
        templateUrl: '../mosaic.html', 
        controller: 'tessellCtrl'
      });
  });

  tess.controller('tessellCtrl', ['$scope', "eventFactory", "$location",  function ($scope, eventFactory, $location){
    // $scope.eventExisits = true;
    $scope.eventTag = "";
    $scope.checkForExistingEvent = function(){
      eventFactory.checkForExistingEvent($scope.eventTag);
      // eventFactory.setEventTag($scope.eventTag);
      // $scope.eventTag = "";
      // $scope.eventExisits = false;
      // $location.path('/dashboard');
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
          formData.append("eventTag", "tacocat");
        },
        'success': function (file, response) {
          console.log('done with sending photo');
        }
      }
    };
  }]);

  tess.factory('eventFactory', ["$http", function ($http){
    var eventFactory = {};
    // eventFactory.setEventTag = function(eventTag){
    //   eventFactory.eventTag = eventTag;
    // }
    eventFactory.checkForExistingEvent = function(eventTag){
      console.log('handling the event checking for', eventTag);
      // eventFactory.eventTag = eventTag;
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

/*tess.controller("tessellCtrl", function ($scope, $location, Upload){
  $scope.testing = false;
  $scope.eventTag = "";

  $scope.createEvent = function(){
    Upload.upload({
      url: '/event',
      file: $scope.event.file
    });
  };

  $scope.go = function (event){
    if($scope.eventTag === "" && event.keyCode === 13){
      $scope.testing = true;
    }
    else if(event.keyCode === 13){
      $scope.eventTag = "";
      $scope.testing = false;
      $location.path('/mosaic');
    }
  };

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
});*/
