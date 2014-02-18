'use strict';

/* Services */
var serverBaseUrl = 'http://155.92.75.163';

var users = [
  { twitterHandle: '', password: 'Scott', email: 'atscott01@gmail.com', subscriptions: []},
  { twitterHandle: '', password: 'user', email: 'scottat@msoe.edu', subscriptions: []}
];
var currentUser;

window.onbeforeunload = function () {
  $.cookie('currentUser', JSON.stringify(currentUser));
};

$(function () {
  var userCookie = $.cookie('currentUser');
  if (userCookie) {
    currentUser = JSON.parse(userCookie);
  }
});

var services = angular.module('myApp.services', []);

services.factory('Authentication', ['$http', function ($http) {
  return{
    login: function (email, password) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/auth/login',
        crossDomain: true,
        data: JSON.stringify({email: email, password: password})
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    getUser: function (email) {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/user/' + email,
        crossDomain: true
      }).then(function (response) {
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    createUser: function (email, password, twitter, phone) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/user',
        crossDomain: true,
        data: JSON.stringify({email: email, password: password, phoneNumber: phone, twitterHandle: twitter})
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    updateUser: function (password, twitter, phone) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/user/' + currentUser.email,
        crossDomain: true,
        data: JSON.stringify({password: password, twitterHandle: twitter, phoneNumber: phone})
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    }
  }
}]);

services.factory('FeedManager', ['$q', '$http', function ($q, $http) {
  return{
    AddFeedForCurrentUser: function (feedUrl) {
      var deferred = $q.defer();
      var feed = new google.feeds.Feed(feedUrl);

      feed.load(function (result) {
        var feed = {link: result.feed.feedUrl, title: result.feed.title};
        if (!result.error) {
          $http({
            method: "POST",
            url: serverBaseUrl + '/user/' + currentUser.email + '/subscription',
            crossDomain: true,
            data: JSON.stringify(feed)
          }).then(function (response) {
            currentUser.subscriptions.push({feed:feed, keyphrases:[]});
            deferred.resolve(response);
          }, function (responseError) {
            console.log(responseError);
            deferred.resolve(responseError);
          });
        } else {
          deferred.resolve({data: {Message: 'invalid feed'}, status: 400});
        }
      });
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
      return $http({
        method: "GET",
        url: serverBaseUrl + '/popular',
        crossDomain: true
      }).then(function (response) {
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    }
  }
}]);

services.factory('KeyphraseManager', ['$q', '$http', function ($q, $http) {
  var subscriptionBeingEdited = null;
  return{
    setSubscriptionBeingEdited: function (subscription) {
      subscriptionBeingEdited = subscription;
    },
    getSubscriptionBeingEdited: function () {
      return subscriptionBeingEdited;
    },
    addKeyphrase: function (keyphrase) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/user/' + currentUser.email + '/subscription/keyphrase',
        crossDomain: true,
        data: JSON.stringify({feed: subscriptionBeingEdited.feed.link, keyphrase: keyphrase.keyphrase})
      }).then(function (response) {
        subscriptionBeingEdited.keyphrases.push(response.data);
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    removeKeyphrase: function (keyphrase) {
      var deferred = $q.defer();
      subscriptionBeingEdited.keyphrases.splice(subscriptionBeingEdited.keyphrases.indexOf(keyphrase), 1);
      deferred.resolve({data: {Message: 'success'}, status: 200});
      return deferred.promise;
    },
    editKeyphrase: function (newKeyphrase, oldKeyphrase) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/user/' + currentUser.email + '/subscription/keyphrase/' + newKeyphrase.id,
        crossDomain: true,
        data: JSON.stringify({keyphrase: newKeyphrase.keyphrase})
      }).then(function (response) {
        subscriptionBeingEdited.keyphrases.splice(subscriptionBeingEdited.keyphrases.indexOf(oldKeyphrase), 1, response.data);
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    }
  }
}]);