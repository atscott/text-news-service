'use strict';

/* Directives */

var directives = angular.module('myApp.directives', []);
directives.directive('appVersion', ['version', function (version) {
  return function (scope, elm, attrs) {
    elm.text(version);
  };
}]);

directives.directive('subscriptionList', function () {
  function link(scope, element) {
    scope.removeSubscription = function (itemIndex) {
      scope.subscriptions.splice(itemIndex, 1);
    }
  }

  return{
    restrict: 'E',
    link: link,
    scope: {
      subscriptions: '='
    },
    templateUrl: 'partials/subscriptions_list.html'
  }
});