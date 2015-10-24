angular.module('MapsHandlerService', [])

.factory('MapsHandlerService', function() {
  // Might use a resource here that returns a JSON array
  var map = null;
  var mapEvent = null;
  var titleMap = "PETAPP";


  /* element -> DOM element que será montado o mapa*/
  function configureFirstTimeMap(element){
      
      getPosition(function(lat,lon){ 
          var minhaPosicao = new google.maps.LatLng(lat, lon);
          
          var mapOptions = {
            center: minhaPosicao,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          
          var map = new google.maps.Map(element, mapOptions);
          addMarker(map,lat,lon);
      });

      
  }

  function getPosition(callback){
      navigator.geolocation.getCurrentPosition(function(pos) {
          callback(pos.coords.latitude, pos.coords.longitude);
      }); 

      
  }

  function addMarker(map,lat,lon){
    
    try{

      var newMarker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lon),
              map: map,
              title: titleMap
      });
    
    }catch(err){
      console.log("addMarker: "+err);
    }

  }

  /*
  google.maps.event.addDomListener(window, 'load', function() {
                $scope.map = map;
    });
 

  */

  return {
    /*maDom -> string com o id do elemento para ser montado*/
    initMap: function(mapDom) {
      element = document.querySelector('#'+mapDom);
      mapEvent = google.maps.event.addDomListener(window, 'load',configureFirstTimeMap(element) );

    },
    
    getPosition : getPosition,
    addMarker: addMarker


    
  };
});
