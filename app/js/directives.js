'use strict';

/* Directives */

var directives = angular.module('myApp.directives', []);
directives.directive('appVersion', ['version', function (version) {
  return function (scope, elm, attrs) {
    elm.text(version);
  };
}]);

directives.directive('subscriptionList', function () {
  function link(scope) {
    scope.removeSubscription = function (itemUrl) {
      var expressionHandler = scope.removeSubscriptionCallback();
      expressionHandler(itemUrl);
    }
  }

  return{
    restrict: 'E',
    transclude:true,
    link: link,
    scope: {
      subscriptions: '=',
      removeSubscriptionCallback: '&'
    },
    templateUrl: 'partials/subscriptions_list.html'
  }
});