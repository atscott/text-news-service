'use strict';

/* Services */

var user1 = {username: 'Andrew', password: 'Scott', email: 'atscot01@gmail.com'};
var user2 = {username: 'user', password: 'user', email: 'scottat@msoe.edu'};
var users = [user1, user2];
var currentUser = {};

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);
services.value('version', '0.1');


services.factory('Authentication', ['$q', function ($q) {
  return{
    login: function (username, password) {
      var deferred = $q.defer();
      $.each(users, function () {
        if (this.username == username && this.password == password) {
          currentUser = this;
          deferred.resolve({status: 200})
        }
      });
      deferred.resolve({data: {Message: 'invalid credentials'}, status: 400});
      return deferred.promise;
    }
  }
}]);

services.factory('FeedManager', ['$q', function ($q) {
  return{
    addFeed: function (userEmail, feedUrl) {
      var deferred = $q.defer();
      var feed = new google.feeds.Feed(feedUrl);
      feed.load(function(result){
        if(!result.error){
          deferred.resolve({data:{Message:result.feed.title}, status:200});
        }else{
          deferred.resolve({data:{Message:'error'}, status:400});
        }
      })
      return deferred.promise;
    }
  }
}]);