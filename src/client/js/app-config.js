/*
 * tess is the name of the main angular application running for tessellate
 * any new controllers, factories, etc that need to be a part of the tessellate
 * application can be created and referenced with tess.
 */
var tess = angular.module("tessell", [
  "ngRoute"
]);

/**
 * Configuration settings for the main angular module, tess, running tessellate
 * $routeProvider is where all the app routes are defiened for the client side
 * controllers and html views for each view should be located here
 *
 * The routes are intercepted to ensure that a user is authorized for the route they
 * are trying to go to. In this version, it checks to see that they are logged in,
 * and re-routing to the login page if they are not logged in via facebook.
 */
tess.config(["$routeProvider", '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: '../login.html',
        controller: 'landingController'
      })
      .when('/events', {
        templateUrl: '../events.html', 
        controller: 'eventsProfileController'
      })
      .when('/event/:eventcode', {
        templateUrl: '../mosaic.html',
        controller: 'mosaicCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $httpProvider.interceptors.push('InterceptResponse');
  }]);

/**
 * http request interceptor attached to the client side routes to check for authorized users
 * before allowing access to any internal routes.
 */
tess.factory('InterceptResponse', ['$q', '$location', function ($q, $location){
  return {
    responseError: function (response){
      if (response.status === 401){
        $location.url('/');
        return $q.reject(response);
      }
    }
  };
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
   dropzone = new Dropzone(element[0], config.options);

   angular.forEach(config.eventHandlers, function (handler, event) {
     dropzone.on(event, handler);
   });
 };
});