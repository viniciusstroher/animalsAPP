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

        window.mapMarkers = new Array();

        return map;       
  }

  function setPosition(lat,lng){
    window.mapLat = lat;
    window.mapLng = lng;
  }

  function centerMap(lat,lng){
    var map = getMapInstance();
    map.setCenter(new google.maps.LatLng(lat,lng));
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



    var circle = new google.maps.Circle({
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: {lat: lat, lng: lon},
      radius: area
    });

    addCircle(circle);

  }

  function getCircle(){
    return window.mapCircles;
  }

  function isHitingCircle(){
    
  }

  function addCircle(circle){
    if(typeof(window.mapCircles) == "undefined")
      window.mapCircles = new Array();
    window.mapCircles.push(circle);
  }

  function addCatMarker(){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Cat-icon.png";
    
    coords = getPosition();
    addRadiusFocus(getMapInstance(),
                    coords.lat,
                    coords.lng,
                    30,
                    '#000000');

    saveNewMarker({coords:coords,animal:'Gato',url:url});
    addCustomMarker(url);
  }

  function addDogMarker(){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Dog-icon.png";
    
    coords = getPosition();
    addRadiusFocus(getMapInstance(),
                    coords.lat,
                    coords.lng,
                    30,
                    '#000000');
    saveNewMarker({coords:coords,animal:'Cachorro',url:url});
    addCustomMarker(url);
  }  

  function saveNewMarker(marker){
    window.mapMarkers.push(marker);
  }

  function getSavedMarkers(marker){
    return window.mapMarkers;
  }
  
  function addCustomMarker(url){
    try{

      coords = getPosition();
     
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(coords.lat,coords.lng),
        map: getMapInstance(),
        icon: url,
        width: 10,
        height: 10
      });

      var infowindow = new google.maps.InfoWindow({
        content: '<img src="'+url+'" />'+'PERDIDO'
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
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
    addCustomMarker : addCustomMarker,
    addCatMarker : addCatMarker,
    addDogMarker : addDogMarker,
    saveNewMarker: saveNewMarker,
    getSavedMarkers: getSavedMarkers,
    centerMap: centerMap,
    addCircle: addCircle,
    getCircle: getCircle
  };
});
