'use strict';

google.load("feeds", "1");

// Declare app level module which depends on filters, and services
var application = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]);
application.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/manageSubscriptions', {templateUrl: 'partials/manage_subscriptions.html', controller: 'ManageSubscriptionsCtrl'});
  $routeProvider.when('/manageKeyphrases',
    {
      templateUrl: 'partials/manage_keyphrases.html',
      controller: 'ManageKeyphrasesCtrl',
      resolve: {
        subscription: function (KeyphraseManager, $location) {
          var subscription = KeyphraseManager.getSubscriptionBeingEdited();
          if(subscription){
            return subscription;
          }else{
            $location.path('/manageSubscriptions')
          }
        }
      }

    });
  $routeProvider.when('/popularFeeds', {templateUrl: 'partials/popular_feeds.html', controller: 'PopularFeedsCtrl'});
  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
  $routeProvider.when('/createAccount', {templateUrl: 'partials/createAccount.html', controller: 'CreateAccountCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

application.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);