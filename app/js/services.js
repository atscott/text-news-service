'use strict';

/* Services */

var user1 = {username: 'Andrew', password: 'Scott', email: 'atscot01@gmail.com', subscriptions: []};
var user2 = {username: 'user', password: 'user', email: 'scottat@msoe.edu', subscriptions: []};
var users = [user1, user2];
var currentUser = user1;

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
  function currentUserIsSubscribedTo(feedUrl) {
    var alreadySubscribed = false;
    $.each(currentUser.subscriptions, function () {
      if (this.url === feedUrl) {
        alreadySubscribed = true;
      }
    });
    return alreadySubscribed;
  }

  return{
    AddFeedForCurrentUser: function (feedUrl) {
      var deferred = $q.defer();
      if (currentUserIsSubscribedTo(feedUrl)) {
        deferred.resolve({data: {Message: 'Already subscribed to feed'}, status: 400});
      } else {
        var feed = new google.feeds.Feed(feedUrl);
        feed.load(function (result) {
          if (!result.error) {
            var newSubscription = {url: feedUrl, title: result.feed.title, keywords: []};
            currentUser.subscriptions.push(newSubscription);
            deferred.resolve({data: newSubscription, status: 200});
          } else {
            deferred.resolve({data: {Message: 'invalid feed'}, status: 400});
          }
        });
      }
      return deferred.promise;
    },
    GetSubscriptionsForCurrentUser: function () {
      var deferred = $q.defer();
      deferred.resolve({data: currentUser.subscriptions, status: 200});
      return deferred.promise;
    },
    RemoveSubscriptionForCurrentUser: function (feedUrl) {
      var deferred = $q.defer();
      $.each(currentUser.subscriptions, function (index) {
        if (this.url == feedUrl) {
          currentUser.subscriptions.splice(index, 1);
          deferred.resolve({data:{Message:"success"},status:200})
        }
      });

      return deferred.promise();
    }
  }
}]);