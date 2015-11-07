angular.module('BackEndHandlerService', [])

.factory('BackEndHandlerService', function($http) {
  // Might use a resource here that returns a JSON array
  var host = 'http://localhost:5126/backend';
  var token = '31290jvjghkjhs90fsnf';

  function saveMark(obj){
    console.log(obj);
  }

  return {
    saveMark: saveMark
  };
});
