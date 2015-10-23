angular.module('MapsHandlerService', [])

.factory('MapsHandlerService', function() {
  // Might use a resource here that returns a JSON array
  var map = null;
  var mapEvent = null;
  var titleMap = "PETAPP";


  /* element -> DOM element que será montado o mapa*/
  function configureFirstTimeMap(element){
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(element, mapOptions);

      navigator.geolocation.getCurrentPosition(function(pos) {
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          var myLocation = new google.maps.Marker({
              position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
              map: map,
              title: titleMap
          });
      });
 
      return map;
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
      //return chats;
    },
    
  };
});
