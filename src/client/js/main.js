var tess = angular.module("tessell", [
  "ngRoute"
])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: './templates/home.html',
        controller: 'tessellCtrl'
      })
      .when('/create', {
        templateUrl: './templates/create.html',
        controller: 'tessellCtrl'
      })
      .when('/join', {
        templateUrl: './templates/join.html', 
        controller: 'tessellCtrl'
      })
  })

tess.controller("tessellCtrl", function ($scope, $location){
  $scope.testing = false;
  $scope.eventTag = "";
  $scope.go = function (event){
    if($scope.eventTag === "" && event.keyCode === 13){
      $scope.testing = true;
    }
    else if(event.keyCode === 13){
      console.log($scope.eventTag);
      $scope.eventTag = "";
      $scope.testing = false;
    }
    // $location.path( path );
  };
})