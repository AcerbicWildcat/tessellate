var login = angular.module("login", [
  "ngRoute",
  "ngCookies"
]);

login.run([ '$rootScope', '$location', function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
  });
}]);

login.controller('AuthController', function ($scope, $window, $location, $cookies, Auth) {
  $scope.signInWithFB = function(){
    console.log('signing in');
    var cookies = $cookies.get("facebookToken");

    //pass along username and token
    Auth.signInWithFB($cookies.get('facebookToken'));
    // $location.path('/events');
 
  };
});

// angular.module('tessellate.authServices', ['ngCookies'])
login.factory('Auth', function ($http, $location, $window){

  var signInWithFB = function(token){
    console.log('TOKEN');

    token = JSON.parse(token);
    console.log(token.facebookId);
    $window.localStorage.setItem('facebookId', token.facebookId);
    //console.dir(token)
    // $location.path('/events');

  };

  return {
    signInWithFB: signInWithFB
  };
});