'use strict';

/* Services */

var users = [
  { twitterHandle: '', password: 'Scott', email: 'atscott01@gmail.com', subscriptions: []},
  { twitterHandle: '', password: 'user', email: 'scottat@msoe.edu', subscriptions: []}
];
var currentUser;

window.onbeforeunload = function () {
  $.cookie('users', JSON.stringify(users));
};

$(function () {
  var usersCookie = $.cookie('users');
  if (usersCookie) {
    users = JSON.parse(usersCookie);
    currentUser = users[0];
  }
});

var services = angular.module('myApp.services', []);

services.factory('Authentication', ['$http', function ($http) {
  return{
    login: function (email, password) {
      return $http({
        method: "POST",
        url: 'http://155.92.64.69/auth/login',
        crossDomain: true,
        data: JSON.stringify({email: email, password: password})
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    createUser: function (email, password, twitter, phone) {
      return $http({
        method: "POST",
        url: 'http://155.92.64.69/user',
        crossDomain: true,
        data: JSON.stringify({email: email, password: password, phoneNumber: phone, twitterHandle: twitter})
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    updateUser: function (email, password, twitter, phone) {
      var data = {};
      if (password) {
        data.password = password;
      }
      if (twitter) {
        data.twitterHandle = twitter;
      }
      if (phone) {
        data.phoneNumber = phone;
      }

      return $http({
        method: "POST",
        url: 'http://155.92.64.69/user/' + email,
        crossDomain: true,
        data: JSON.stringify(data)
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        return responseError;
      });
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
            var newSubscription = {url: feedUrl, title: result.feed.title, keyphrases: []};
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
          deferred.resolve({data: {Message: "success"}, status: 200});
          return false;
        }
      });

      return deferred.promise;
    },
    GetPopularFeeds: function () {
      var deferred = $q.defer();
      var popularFeeds = {};
      var popularFeedsArray = [];
      $.each(users, function (index, user) {
        $.each(user.subscriptions, function (index, subscription) {
          if (popularFeeds[subscription.url]) {
            popularFeeds[subscription.url].count += 1;
          } else {
            popularFeeds[subscription.url] = $.extend({}, subscription);
            popularFeeds[subscription.url].count = 1;
          }
        });
      });
      $.each(popularFeeds, function () {
        popularFeedsArray.push(this);
      });
      deferred.resolve({data: popularFeedsArray, status: 200});
      return deferred.promise;
    }
  }
}]);

services.factory('KeyphraseManager', ['$q', function ($q) {
  var subscriptionBeingEdited = null;
  return{
    setSubscriptionBeingEdited: function (subscription) {
      subscriptionBeingEdited = subscription;
    },
    getSubscriptionBeingEdited: function () {
      return subscriptionBeingEdited;
    },
    addKeyphrase: function (keyphrase) {
      var deferred = $q.defer();
      subscriptionBeingEdited.keyphrases.push(keyphrase);
      deferred.resolve({data: {Message: 'success'}, status: 200});
      return deferred.promise;
    },
    removeKeyphrase: function (keyphrase) {
      var deferred = $q.defer();
      subscriptionBeingEdited.keyphrases.splice(subscriptionBeingEdited.keyphrases.indexOf(keyphrase), 1);
      deferred.resolve({data: {Message: 'success'}, status: 200});
      return deferred.promise;
    },
    editKeyphrase: function (newKeyphrase, oldKeyphrase) {
      var deferred = $q.defer();
      subscriptionBeingEdited.keyphrases.splice(subscriptionBeingEdited.keyphrases.indexOf(oldKeyphrase), 1, newKeyphrase);
      deferred.resolve({data: {Message: 'success'}, status: 200});
      return deferred.promise;
    }
  }
}]);