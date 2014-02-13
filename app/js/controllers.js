'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('MyCtrl1', [function () {

}]);

controllers.controller('MyCtrl2', [function () {

}]);

controllers.controller('LoginCtrl', ['$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
  $scope.user = {};

  $scope.submit = function () {
    Authentication.login($scope.user.username, $scope.user.password).then(function (response) {
      if (response.status != 200) {
        var message = response.data.Message;
        if (message == null || message.length < 1) {
          message = "Something went wrong (Error code " + response.status + ")";
        }
        $scope.showAlert(message);
      } else {
        $location.path('/view1');
      }
    });
  };

  $scope.showAlert = function (message) {
    $scope.alert = {msg: message};
  };

  $scope.closeAlert = function () {
    $scope.alert = null;
  };
}]);

controllers.controller('AddFeedCtrl', ['$scope', 'FeedManager', function ($scope, FeedManager) {
  $scope.subscriptions = [];
  $scope.feed = {};
  $scope.addFeed = function () {
    FeedManager.addFeed(currentUser.email, $scope.feed.url).then(function (response) {
      $scope.feed.title = response.data.Message;
      $scope.subscriptions.push($.extend({}, $scope.feed));
    });
  }
}]);