angular.module('map.controllers', [])

.controller('MapController', function($scope,$ionicModal,MapsHandlerService) {
    controllerMap = 'map';
    
    $scope.updateTextArea = function(element){
        console.log(element);
        $scope.descri = element.value;
    }
    
    $scope.saveLostAnimal = function(){
        scopoModal = $scope.modal.scope;

        animal = scopoModal.animal;
        healthStatus = new Array();

        if(typeof(scopoModal.healthStatus1) != "undefined")
            healthStatus.push(scopoModal.healthStatus1);
        if(typeof(scopoModal.healthStatus2) != "undefined")
            healthStatus.push(scopoModal.healthStatus2);
        if(typeof(scopoModal.healthStatus3) != "undefined")
            healthStatus.push(scopoModal.healthStatus3);
        if(typeof(scopoModal.healthStatus4) != "undefined")
            healthStatus.push(scopoModal.healthStatus4);
        if(typeof(scopoModal.healthStatus5) != "undefined")
            healthStatus.push(scopoModal.healthStatus5);
        
        descri = "";
        
        if(typeof(scopoModal.descri) != "undefined"){
            descri = scopoModal.descri;
            scopoModal.descri = "";
        }


        
        var postData = {animal: animal,
                        estado: healthStatus,
                        descri: descri};


        switch(animal){
            case 'cat': 
                MapsHandlerService.addCatMarker(postData);
            break;
            
            case 'dog':
                MapsHandlerService.addDogMarker(postData);
            break;
            
            case 'others':
                MapsHandlerService.addOthersMarker(postData);
            break;
        }


        


        //CRIAR SERVIÇO PARA SALVAR NO BACKEND
        $scope.modal.hide();
      
    }

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