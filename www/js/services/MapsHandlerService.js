angular.module('MapsHandlerService', [])

.factory('MapsHandlerService', function() {
  // Might use a resource here that returns a JSON array
  var map = null;
  var mapEvent = null;
  var titleMap = "PETAPP";


  function registerWatcherPosition(callback){
      if(typeof(callback) != "undefined")
        navigator.geolocation.watchPosition(callback);
  }

  /* element -> DOM element que será montado o mapa*/
  function setMyFirstPos(){
      
      getNewPosition(function(lat,lon){ 
          if(getMapInstance() != null){
            map = window.mapApp;
          }else{
            map = mountMap(element,lat,lon);
          }

          addMarker(map,lat,lon);

          
         
      });

         
  }

  function mountMap(element,lat,lon){
        var minhaPosicao = new google.maps.LatLng(lat, lon);
          
        var mapOptions = {
          center: minhaPosicao,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        if(window.mapApp == undefined){
          var map = new google.maps.Map(element, mapOptions);
          window.mapApp = map;
        }else{
          map = window.mapApp;
        }

        return map;       
  }

  function setPosition(lat,lng){
    window.mapLat = lat;
    window.mapLng = lng;
  }

  function getPosition(){
    return new google.maps.LatLng(window.mapLat, window.mapLng);
  }
  function getNewPosition(callback){
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

  function setMapEventListener(mapDom){
      element = document.querySelector('#'+mapDom);
      mapEvent = google.maps.event.addDomListener(window, 'load',setMyFirstPos(element) );

      return element;
  }



  function getMapInstance(){
      if(typeof(window.mapApp) != "undefined")
        return window.mapApp;
      return null;

  }

  function addRadiusFocus(map,lat,lon){
    
    area = 10;

    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: {lat: lat, lng: lon},
      radius: area * 10
    });

  }

  return {
    /*maDom -> string com o id do elemento para ser montado*/
    initMap: function(mapDom) {
      setMapEventListener(mapDom);
      //mountMap(element);
    },

    setMapEventListener: setMapEventListener,
    getPosition : getPosition,
    setPosition : setPosition,
    getNewPosition : getNewPosition,
    addMarker: addMarker,
    addRadiusFocus: addRadiusFocus,
    setMyFirstPos : setMyFirstPos,
    mountMap: mountMap,
    getMapInstance: getMapInstance,
    registerWatcherPosition : registerWatcherPosition
  };
});
