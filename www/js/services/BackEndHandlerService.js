angular.module('BackEndHandlerService', [])

.factory('BackEndHandlerService', function($http) {
  // Might use a resource here that returns a JSON array
  var host = 'http://localhost:56292/';
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
    console.log(obj);

    var postData = {
      "AuthToken" : token,
	    "IdRegistroAnimal": 0,
	    "IdTipoAnimal": 0,
	    "IdEstadoAnimal": 0,
	    "IdSituacaoAnimal": 0,
	    "Descricao": "string",
	    "Latitude": 0,
	    "Longitude": 0
	};


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
    saveMark: saveMark
  };
});
