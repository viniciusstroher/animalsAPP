angular.module('map.controllers', [])

.controller('MapController', function($scope,$ionicModal,MapsHandlerService) {
    controllerMap = 'map';
    

    $ionicModal.fromTemplateUrl('select_animal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    
    }).then(function(modal) {
        $scope.modal = modal;
    });

    MapsHandlerService.initMap(controllerMap);
    //Register Watch adiciona o marker a cada pulso de GPS
    MapsHandlerService.registerWatcherPosition(function(pos){
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;

        MapsHandlerService.setPosition(lat,lon);
        /*MapsHandlerService.addRadiusFocus(MapsHandlerService.getMapInstance(),
                                            lat,
                                            lon,
                                            10,
                                            '#000000');*/
        MapsHandlerService.drawMyPos(lat,lon);
    });


    $scope.addAnimal = function(){

      var coordenada = MapsHandlerService.getPosition();
      
      $scope.modal.show();
      
    };

    $scope.escolheGato = function(){
        MapsHandlerService.addCatMarker();
        $scope.modal.hide();
      
    }

    $scope.escolheCachorro = function(){
        MapsHandlerService.addDogMarker();
        $scope.modal.hide();
    }

     

      

});