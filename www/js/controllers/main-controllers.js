angular.module('main.controllers', [])

.controller('DashCtrl', function($scope,$state,MapsHandlerService) {
    var markers = MapsHandlerService.getSavedMarkers();
    if(typeof(markers) != "undefined")
      $scope.places = markers;
    
    $scope.gotoAnimal = function(lat,lon){
      MapsHandlerService.centerMap(lat,lon);
      $state.go("tab.geo");
    }
})
.controller('GeoCtrl', function($cordovaGeolocation,$scope) {

  

  
});