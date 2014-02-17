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
    };

    scope.editKeyphrasesForFeed = function (item) {
      var expressionHandler = scope.editKeyphrasesCallback();
      expressionHandler(item);
    }
  }

  return{
    restrict: 'E',
    transclude: true,
    link: link,
    scope: {
      subscriptions: '=',
      removeSubscriptionCallback: '&',
      editKeyphrasesCallback: '&'
    },
    templateUrl: 'partials/subscriptions_list.html'
  }
});

directives.directive('ngBlur', ['$parse', function ($parse) {
  return function (scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function (event) {
      scope.$apply(function () {
        fn(scope, {$event: event});
      });
    });
  }
}]);

directives.directive('keyphraseList', function () {
  function link(scope) {
    scope.editKeyphrase = function (keyphrase) {
      var expressionHandler = scope.editKeyphraseCallback();
      expressionHandler(keyphrase);
    };

    scope.removeKeyphrase = function (keyphrase) {
      var expressionHandler = scope.removeKeyphraseCallback();
      expressionHandler(keyphrase);
    };
  }

  return{
    restrict: 'E',
    link: link,
    scope: {
      keyphrases: '=',
      removeKeyphraseCallback: '&',
      editKeyphraseCallback: '&'
    },
    templateUrl: 'partials/keyphrase_list.html'
  }

});


directives.directive('focusEdit', function($timeout) {
  return {
    link: function(scope, element) {
      element.bind('click', function() {
        $timeout(function() {
          $("#keyphraseEdit").focus();
        });
      });
    }
  };
});