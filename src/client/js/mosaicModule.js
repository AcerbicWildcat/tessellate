angular.module('tessell.mosaic', [])
  .controller('mosaicCtrl', ['$scope', 'eventFactory', function ($scope, eventFactory){
    console.log(eventFactory.mosaicRetrieved);
    console.log(eventFactory.mainMosaicImage);

  }]);
