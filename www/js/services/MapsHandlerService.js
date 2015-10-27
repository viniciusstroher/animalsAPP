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

  function drawMyPos(lat,lon){
    addRadiusFocus(getMapInstance(),
                                            lat,
                                            lon,
                                            10,
                                            '#000000');
  }

  /* element -> DOM element que será montado o mapa*/
  function setMyFirstPos(){
      
      getNewPosition(function(lat,lon){ 
          if(getMapInstance() != null){
            map = window.mapApp;
          }else{
            map = mountMap(element,lat,lon);
          }

          drawMyPos(lat,lon);

          
         
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

        window.mapLat = lat;
        window.mapLng = lon;


        return map;       
  }

  function setPosition(lat,lng){
    window.mapLat = lat;
    window.mapLng = lng;
  }

  function getPosition(){
    lat = window.mapLat;
    lng = window.mapLng;
    
    return {lat: lat, lng: lng};
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

  function addRadiusFocus(map,lat,lon,area,color){

    var cityCircle = new google.maps.Circle({
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: {lat: lat, lng: lon},
      radius: area
    });

  }

  function addCatMarker(){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Cat-icon.png";
    addCustoMarker(url);
  }

  function addDogMarker(){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Dog-icon.png";
    addCustoMarker(url);
  }  
  
  function addCustoMarker(url){
    try{

      coords = getPosition();
      
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(coords.lat,coords.lng),
        map: getMapInstance(),
        icon: url,
        width: 10,
        height: 10
      });

    }catch(err){
      console.log('addCustoMarker: '+err);
    }
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
    drawMyPos : drawMyPos,
    registerWatcherPosition : registerWatcherPosition,
    addCustoMarker : addCustoMarker,
    addCatMarker : addCatMarker,
    addDogMarker : addDogMarker
  };
});
