tess.factory('httpRequestFactory', [ '$http', '$location', '$q', function ($http, $location, $q){
  var httpRequestFactory = {};
  httpRequestFactory.getUserProfile = function(){
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
      httpRequestFactory.fullUserProfile = response.data;
      return response;
    });
  };
  httpRequestFactory.getUserEvents = function(){
    return $http({
      method: 'GET',
      url: '/events'
    }).then(function(response){
      httpRequestFactory.userEvents = response.data;
      return response;
    });
  };
  httpRequestFactory.getEvent = function(eventCode){
    return $http({
      method: 'GET',
      url:'/events/'+ eventCode
    }).then(function(response){
      httpRequestFactory.currentEvent = response.data;
      return response;
    });
  };
  httpRequestFactory.joinEvent = function(eventCode){
    return $http({
      method: 'POST',
      url: '/events/' + eventCode,
    }).then(function(response){
      return response;
    });
  };
  httpRequestFactory.updateMap = function(segmentsToUpdate, eventCode){
    return $http({
      method: 'POST',
      url: '/events/' + eventCode + '/map',
      data: {
        segmentsToUpdate: segmentsToUpdate,
        eventCode: eventCode
      }
    }).then(function(response){
      return response;
    });
  };
  httpRequestFactory.logout = function(){
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function (response){
      return response;
    });
  };
  return httpRequestFactory;
}]);