angular.module('MapsHandlerService', ['BackEndHandlerService'])

.factory('MapsHandlerService', function(BackEndHandlerService,$compile) {
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
    

    //coords = getPosition();
    coords = {lat: postData.lat, lng : postData.lng};

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


    
    //remover getPosition 
    //coords = getPosition();
    coords = {lat: postData.lat, lng : postData.lng};

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

    //coords = getPosition();
    coords = {lat: postData.lat, lng : postData.lng};

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

  function getSavedMarkers(){
    return window.mapMarkers;
  }
  

  function isRegistroExists(id){
    markers = getSavedMarkers();
    for(m in markers){
      useMarker = markers[m];
      if(useMarker.data.idanimal == id)
        return true;
    }

    return false;
  }

  function addLabel(coords,postData){
    var label = '<div  class="compile_box" id="coords_'+coords.lat+'_'+coords.lng+'"><center><img src="'+postData.url+'" /> '+
                  '<table>'+
                  '<tr>'+
                  '<td><b>Tipo do Animal:</b></td>'+'<td>'+postData.animal+'</td>'+
                  '</tr>'+
                  
                  '<tr>'+
                  '<td><b>Estado do Animal</b></td>' +'<td>'+postData.data.estado.join(',')+'</td>'+
                  '</tr>'+

                  '<tr>'+
                  '<td><b>Situação Atual:</b></td>'+'<td>'+
                                              '<select registro="'+postData.data.idanimal+'">'+
                                                '<option value=1>Nenhuma providencia foi tomada</option>'+
                                                '<option value=2>Recebeu comida</option>'+
                                                '<option value=3>Recebeu cuidados medicos</option>'+
                                                '<option value=4>Recebeu auxilio</option>'+
                                                '<option value=5>Transportado para abrigo</option>'+
                                                '<option value=6>Animal com raiva e stressado</option>'+
                                                '<option value=7>Não Encontrado</option>'+
                                              '</select>'+
                                              '</td>'+
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
      coords = postData.coords;
      //coords = getPosition();
      if(postData.circle.marker == null){
        
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat,coords.lng),
          map: getMapInstance(),
          icon: postData.url,
          width: 10,
          height: 10
        });
        
        var infowindow = new google.maps.InfoWindow({
          content: addLabel(coords,postData)
        });

        
        

        marker.addListener('click', function() {
          infowindow.open(getMapInstance(), marker);

          
          google.maps.event.addListener(infowindow, 'domready', function(){
              angular.element(document.querySelectorAll("div select")).bind("change",function(event){
                
                selectOpts = event.target.options;
                idselect = event.target.getAttribute("registro");

                for(opt in selectOpts){
                  optUsing = selectOpts[opt];
                  if(optUsing.selected){

                    alert(optUsing.value+"##"+idselect);
                    break;
                  }

                }
              });
              
          }); 
          
        });




        postData.circle.marker = marker;
        postData.circle.infowindow = infowindow;
      }else{

        postData.circle.infowindow.close();

        //console.log('infowindow',postData.circle.marker);

        postData.circle.marker.setIcon("../img/others.png");

        cache = postData.circle.infowindow.content;

        postData.circle.marker.addListener('click', function() {
          

          postData.circle.infowindow.setContent(cache + addLabel(coords,postData));
          postData.circle.infowindow.open(getMapInstance(), postData.circle.marker);
          

        });          
        
        postData.circle.infowindow.setContent(cache + addLabel(coords,postData));
   
        //postData.circle.marker = marker;
      
      }
      
      

      
    }catch(err){
      console.log('addCustoMarker: '+err);
    }
  }

  function loadMarkerNear(lat,lon){
    var map = getMapInstance();
    
    BackEndHandlerService.loadMark(lat,lon,function(resp){
        //MONTAR !!!
        for(d in resp){
          

          var obj = resp[d];
          var animal = "";

          if (obj.IdTipoAnimal == 1)
            animal = "cat";
          if (obj.IdTipoAnimal == 2)
            animal = "dog";
          if (obj.IdTipoAnimal == 3)
            animal = "others";

          var estados = new Array();

          for(estado in obj.EstadoAnimal){
            switch(obj.EstadoAnimal[estado]){
              case 1:
                estados.push('fome');
              break;

              case 2:
                estados.push('doente');
              break;

              case 3:
                estados.push('medo');
              break;

              case 4:
                estados.push('raiva');
              break;

              
            }
          }

          postData = {animal:animal,
                      estado:estados,
                      descri: "("+obj.IdRegistroAnimal +") "+obj.Descricao,
                      lat:obj.Latitude,
                      lng:obj.Longitude,
                      idanimal : obj.IdRegistroAnimal,
                      situacao : obj.IdSituacaoAnimal};
          
          if(!isRegistroExists(obj.IdRegistroAnimal)){
            switch(obj.IdTipoAnimal){
              
              case 1:
                addCatMarker(postData);
              break;

              case 2:
                addDogMarker(postData);
              break;

              case 3:
                addOthersMarker(postData);
              break;
            }
          }  
        }

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
    addLabel: addLabel,
    loadMarkerNear: loadMarkerNear
  };
});
