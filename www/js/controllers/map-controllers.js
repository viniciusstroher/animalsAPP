angular.module('map.controllers', [])

.controller('MapController', function($scope,MapsHandlerService) {
    controllerMap = 'map';
    
    MapsHandlerService.initMap(controllerMap);
    //Register Watch adiciona o marker a cada pulso de GPS
    MapsHandlerService.registerWatcherPosition(function(pos){
        alert("init event gps listener");
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        MapsHandlerService.addMarker(MapsHandlerService.getMapInstance(),lat,lon);
    });


    $scope.addAnimal = function(){
      MapsHandlerService.getNewPosition(function(lat,lon){
        MapsHandlerService.setPosition(lat,lon);  
        MapsHandlerService.addRadiusFocus(MapsHandlerService.getMapInstance(),lat,lon);

      });

    };
});
