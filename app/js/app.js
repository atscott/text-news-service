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
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/manageSubscriptions', {templateUrl: 'partials/manage_subscriptions.html', controller: 'ManageSubscriptionsCtrl'});
  $routeProvider.when('/manageKeyphrases',
    {
      templateUrl: 'partials/manage_keyphrases.html',
      controller: 'ManageKeyphrasesCtrl',
      resolve: {
        keyphrases: function (KeyphraseManager, $location) {
          var subscription = KeyphraseManager.getSubscriptionBeingEdited();
          if(subscription){
            return subscription.keyphrases;
          }else{
            $location.path('/manageSubscriptions')
          }
        }
      }

    });
  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
  $routeProvider.when('/createAccount', {templateUrl: 'partials/createAccount.html', controller: 'CreateAccountCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
