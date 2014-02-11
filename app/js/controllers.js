'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers',[]);

controllers.controller('MyCtrl1', [function () {

}]);

controllers.controller('MyCtrl2', [function () {

}]);

controllers.controller('LoginCtrl', ['$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
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