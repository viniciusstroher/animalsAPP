angular.module('map.controllers', [])

.controller('MapController', function($scope,$ionicModal,MapsHandlerService) {
    controllerMap = 'map';
    
    $scope.updateTextArea = function(element){

        $scope.descri = element.value;
        //coment do merge
    }
    
    $scope.fomeSelected = false;
    $scope.doenteSelected = false;
    $scope.medoSelected = false;
    $scope.raivaSelected = false;

    $scope.selectFome = function(){
        $scope.fomeSelected = !$scope.fomeSelected;
    }

     $scope.selectDoente = function(){
        $scope.doenteSelected = !$scope.doenteSelected;
    }
     $scope.selectMedo = function(){
        $scope.medoSelected = !$scope.medoSelected;
    }

     $scope.selectRaiva = function(){
        $scope.raivaSelected = !$scope.raivaSelected;
    }

    $scope.saveLostAnimal = function(){
        scopoModal = $scope.modal.scope;

        animal = scopoModal.animal;
        healthStatus = new Array();

        if($scope.fomeSelected)
            healthStatus.push("fome");
        if($scope.doenteSelected)
            healthStatus.push("doente");
        if($scope.medoSelected)
            healthStatus.push("medo");
        if($scope.raivaSelected)
            healthStatus.push("raiva");
        
        descri = "";
        
        if(typeof(scopoModal.descri) != "undefined"){
            descri = scopoModal.descri;
            scopoModal.descri = "";
        }

        coords = MapsHandlerService.getPosition();
        
        var postData = {animal: animal,
                        estado: healthStatus,
                        descri: descri,
                        lat:coords.lat,
                        lng:coords.lng};


        //Limpa os objetos antes de enviar o post
        scopoModal.healthStatus1 = null;
        scopoModal.healthStatus2 = null;
        scopoModal.healthStatus3 = null;
        scopoModal.healthStatus4 = null;
        scopoModal.healthStatus5 = null;

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
        MapsHandlerService.loadMarkerNear(lat,lon);
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