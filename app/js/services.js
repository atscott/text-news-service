'use strict';

/* Services */

 var user1 = {username: 'Andrew', password: 'Scott'};
  var user2 = {username: 'user', password: 'user'};
  var users = [user1, user2];

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);
services.value('version', '0.1');


services.factory('Authentication', ['$q', function ($q) {
  return{
    login: function (username, password) {
      var deferred = $q.defer();
      var valid = false;
      $.each(users, function () {
        if (this.username == username && this.password == password) {
          deferred.resolve({status:200})
        }
      });
      deferred.resolve({data:{Message: 'invalid credentials'}, status:400});
      return deferred.promise;
    }
  }
}]);