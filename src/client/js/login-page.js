tess.controller('landingController', ['$scope', function ($scope){
  $scope.loaded = true;
  $scope.startSpinner = function(){
    $scope.loaded =false;
  };
}]);