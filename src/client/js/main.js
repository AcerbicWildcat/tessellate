/**
 * tess is the main angular module.
 * @type {angular module}
 */
var tess = angular.module("tessell", [
  "ngRoute",
  "flow",
  'authServices'
])
  // uncomment code below to add auth checks on protected resources
  .config(function ($routeProvider, $httpProvider, ResInterceptor, AuthCheck){
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
  })

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
   return '';
    };
   });
