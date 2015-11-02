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
    if(typeof(window.myPosCircle) != "undefined" ){
        window.myPosCircle.setMap(null);
        window.myPosCircle = null;
    }

    circle = addRadiusFocus(getMapInstance(),
                                            lat,
                                            lon,
                                            10,
                                            'red');
    //refresh my pos - deletando as antigas


    window.myPosCircle = circle;
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
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
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

    return circle;

  }

  function getCircle(){
    return window.mapCircles;
  }

  function isHitingCircle(lat,lon){
    var atualCoords = new google.maps.LatLng(lat,lon);

    var circles = getCircle();

    var maisPerto = null;

    for(c in circles){
        var circle = circles[c];
        var center = circle.getCenter();
        var radius = circle.getRadius();
        var bounds = circle.getBounds();


        var distance = google.maps.geometry.spherical.computeDistanceBetween(atualCoords, center);
        //console.log("Distance: "+distance+"###"+radius);
        
        if(distance<=radius)
          maisPerto = circle;
    }
    
    return maisPerto;
  }

  function addCircle(circle){
    if(typeof(window.mapCircles) == "undefined")
      window.mapCircles = new Array();
    window.mapCircles.push(circle);
  }

  function addCatMarker(postData){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Cat-icon.png";
    circle = null;
    coords = getPosition();
    hit = isHitingCircle(coords.lat,coords.lng);
    
    if(hit == null){

      circle = addRadiusFocus(getMapInstance(),
                    coords.lat,
                    coords.lng,
                    30,
                    '#000000');
      addCircle(circle);
    }else{
      circle = hit;
    }

    infoPackge = {circle:circle,coords:coords,animal:'Gato',url:url, data: postData};
    saveNewMarker(infoPackge);
    addCustomMarker(infoPackge);
  }

  function addDogMarker(postData){
    url = "http://icons.iconarchive.com/icons/icons8/windows-8/32/Animals-Dog-icon.png";
    circle = null;
    coords = getPosition();
    hit = isHitingCircle(coords.lat,coords.lng);
    
    if(hit == null){

      circle = addRadiusFocus(getMapInstance(),
                    coords.lat,
                    coords.lng,
                    30,
                    '#000000');
      addCircle(circle);
    }else{
      circle = hit;
    }

    infoPackge = {circle:circle,coords:coords,animal:'Cachorro',url:url, data: postData};
    saveNewMarker(infoPackge);
    addCustomMarker(infoPackge);
  }

  function addOthersMarker(postData){
    url = "../img/others.png";
    circle = null;
    coords = getPosition();
    hit = isHitingCircle(coords.lat,coords.lng);
    
    if(hit == null){

      circle = addRadiusFocus(getMapInstance(),
                    coords.lat,
                    coords.lng,
                    30,
                    '#000000');
      addCircle(circle);
    }else{
      circle = hit;
    }

    infoPackge = {circle:circle,coords:coords,animal:'Outro',url:url, data: postData};
    saveNewMarker(infoPackge);
    addCustomMarker(infoPackge);
  }  

  function saveNewMarker(marker){
    window.mapMarkers.push(marker);
  }

  function getSavedMarkers(marker){
    return window.mapMarkers;
  }
  
  function addLabel(coords,postData){
    var label = '<div id="coords_'+coords.lat+'_'+coords.lng+'"><center><img src="'+postData.url+'" /> '+
                  '<table>'+
                  '<tr>'+
                  '<td><b>Tipo do Animal:</b></td>'+'<td>'+postData.animal+'</td>'+
                  '</tr>'+
                  
                  '<tr>'+
                  '<td><b>Estado do Animal</b></td>' +'<td>'+postData.data.estado.join(',')+'</td>'+
                  '</tr>'+

                  '<tr>'+
                  '<td><b>Descrição:</b></td>'+'<td>'+postData.data.descri+'</td>'+
                  '</tr>'+
                  

                  '</table>'+

                  '</center> </div>';
    return label;
  }

  function addCustomMarker(postData){
    try{

      coords = getPosition();
     


      var infowindow = new google.maps.InfoWindow({
        content: addLabel(coords,postData)
      });

      if(postData.circle.marker == null){
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat,coords.lng),
          map: getMapInstance(),
          icon: postData.url,
          width: 10,
          height: 10
        });
        

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        postData.circle.marker = marker;
        postData.circle.infowindow = infowindow;
      }else{
        console.log('infowindow',postData.circle.infowindow);
        cache = postData.circle.infowindow.content;

        postData.circle.infowindow.content = cache + addLabel(coords,postData);
        postData.circle.marker.addListener('click', function() {
          infowindow.open(map, postData.circle.marker);
        });

        //postData.circle.marker = marker;
      
      }
      

      
      
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
    addOthersMarker: addOthersMarker,
    saveNewMarker: saveNewMarker,
    getSavedMarkers: getSavedMarkers,
    centerMap: centerMap,
    addCircle: addCircle,
    getCircle: getCircle,
    isHitingCircle : isHitingCircle,
    addLabel: addLabel
  };
});
