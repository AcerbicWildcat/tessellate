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
    $scope.eventTag = "";
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
          formData.append("eventTag", $scope.eventTag);
        },
        'success': function (file, response) {
          console.log('done with sending photo');
        }
      }
    };
  }]);

  tess.factory('eventFactory', ["$http", function ($http){
    var eventFactory = {};
    eventFactory.checkForExistingEvent = function(eventTag){
      $http.post('/event/join', {eventCode: eventTag})
        .then(function(response){
          console.log(response);
        })
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

