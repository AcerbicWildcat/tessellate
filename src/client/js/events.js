tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.createdEvents = [];
  $scope.joinedEvents = [];
  $scope.hasCreated = false;
  $scope.hasJoined = false;
  $scope.loaded = true;

  $scope.getUserEvents = function(){
    httpRequestFactory.getUserEvents()
      .then(function(response){
        $scope.userEvents = response.data;
        for(var i=0; i<response.data.events.length; i++){
          if(response.data._id === response.data.events[i]._creator){
            $scope.hasCreated = true;
            $scope.createdEvents.push(response.data.events[i]);
          }else{
            $scope.hasJoined = true;
            $scope.joinedEvents.push(response.data.events[i]);
          }
        }
      });
  };
  $scope.joinEvent = function(eventCode){
    if(!!eventCode){
      $scope.loaded = false;
      httpRequestFactory.joinEvent(eventCode)
        .then(function(response){
          if(response.data.error){
            $scope.loaded = true;
            $scope.errorMessage = response.data.error;
            if(response.data.error === "event does not exist"){
              $scope.join = false;
              $scope.create = true;
            }else if(response.data.error === "Sorry, this is an event you have created"){
              $scope.create = false;
              $scope.join = true;
              $scope.getEvent(eventCode);
            }
          }else{ 
            $scope.loaded = true;
            $scope.errorMessage = "";
            $scope.getEvent(eventCode);
          }
        });
    }
    else if(!eventCode){
      $scope.create = true;
    }
  };

  $scope.getEvent = function(eventCode){
    httpRequestFactory.getEvent(eventCode)
      .then(function(response){
        $location.url('/event/' + eventCode);
      });
  };

  $scope.logout = function (){
    httpRequestFactory.logout()
      .then(function(response){
        $location.url('/');
      });
  };

  $scope.dropzoneConfig = {
    'options': {
      'url': '/event',
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'autoProcessQueue': false,
      'acceptedFiles': 'image/jpeg, image/png',
      init: function(){
        dz = this;
        $('.submit-all').click(function(){
          if(!!$scope.eventCode && !!$scope.eventName && dz.files.length === 1){
            $scope.loaded = false;
            $scope.$apply();
            dz.processQueue();
            dz.removeAllFiles();
          }
        });
      }
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        formData.append("eventCode", $scope.eventCode);
        formData.append("eventName", $scope.eventName);
      },
      'success': function (file, response) {
        $scope.loaded = true;
        $scope.$apply();
        $scope.getEvent($scope.eventCode);
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      }
    }
  };

  $scope.close = function(){
    $scope.create = false;
  };
  
  $scope.getUserEvents();

  $scope.$on('redraw', function (newMosaicData){
    mosaicFactory.redrawImages(newMosaicData);
  });

  $scope.currentEvent = httpRequestFactory.currentEvent;

}]);