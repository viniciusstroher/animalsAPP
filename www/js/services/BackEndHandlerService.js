angular.module('BackEndHandlerService', [])

.factory('BackEndHandlerService', function($http) {
  // Might use a resource here that returns a JSON array
  var host = 'http://capemisa-hom.aplub.com.br/animalsapi/';
  //var host = 'http://localhost:56292/';
  var token = '882b1bf1-fa10-4b37-8f67-fbd9e1fee68f';


  var address = {
  	GetAllTags : 'GetAllTags',
  	GetAllStates : 'GetAllStates',
  	GetAllSituations : 'GetAllSituations',
  	GetAllAnimalTipes : 'GetAllAnimalTipes',
  	SavePetLocation : 'SavePetLocation',
  	UpdatePetLocation : 'UpdatePetLocation'
  };


  function saveMark(obj){
    
    var postData = convertDataToBackEnd(obj);
    sendToBackEndData(postData);
    
  }

  function loadMark(lat,lng,callback){
    //console.log(lat1,lng1,lat2,lng2);
    postData = { "Latitude" : lat,
                  "Longitude" : lng};
    $http({
              url: host+address.GetAllTags,
              method: "POST",
              data: postData,
              headers: {'Content-Type': 'application/json',
                  'AuthToken' : token}})
    
    .success(function(resp){
      
        console.log("loadMark http success",resp);
        callback(resp);
      }).error(function(err){
      
        console.log("loadMark http error",err);
      
      });


  }

  function convertDataToBackEnd(obj){
    backendData = {};

    if(obj.animal == "Gato")
      IdTipoAnimal = 1;   
    else if(obj.animal == "Cachorro")
      IdTipoAnimal = 2;
    else
      IdTipoAnimal = 3;

    
    var situacao = new Array();
    /*situacao*/
    if(obj.data.estado.indexOf("fome") != -1)
      situacao.push(1);   
    if(obj.data.estado.indexOf("doente") != -1)
      situacao.push(2);
    if(obj.data.estado.indexOf("medo") != -1)
      situacao.push(3);
    if(obj.data.estado.indexOf("raiva") != -1)
      situacao.push(4);   
    
    //CRIAR ARRAY PARA SITUAÇAO E INSERIR SOH ID
    backendData.Latitude =  obj.coords.lat.toFixed(4);
    backendData.Longitude = obj.coords.lng.toFixed(4);
    backendData.Descricao = obj.data.descri;
    backendData.IdSituacaoAnimal = 1; //NOT TAGGED
    backendData.IdTipoAnimal = IdTipoAnimal;
    backendData.EstadoAnimal = situacao;

    console.log('backendData obj',obj);
    console.log('backendData',backendData);

    return backendData;
  }

  function sendToBackEndData(postData){
    console.log('SEND POSTDATA',backendData);
   
  	$http({
              url: host+address.SavePetLocation,
              method: "POST",
              data: postData,
              headers: {'Content-Type': 'application/json',
          				'AuthToken' : token}})
  	
  	.success(function(resp){
      
      	console.log("saveMARK http success",resp);
      
      }).error(function(err){
      
      	console.log("saveMARK http error",err);
      
      });

  }


  return {
    saveMark: saveMark,
    loadMark: loadMark
  };
});
