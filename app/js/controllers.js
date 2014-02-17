'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('LoginCtrl', ['$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
  $scope.user = {};

  $scope.submit = function () {
    Authentication.login($scope.user.email, $scope.user.password).then(function (response) {
      if (response.status != 200) {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Something went wrong (Error code " + response.status + ")";
        }
        $scope.showAlert(message);
      } else {
        $location.path('/manageSubscriptions');
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

controllers.controller('ManageSubscriptionsCtrl', ['$scope', 'FeedManager', 'KeyphraseManager', '$location',
  function ($scope, FeedManager, KeyphraseManager, $location) {
    $scope.subscriptions = [];
    $scope.feed = {};

    $scope.getUserSubscriptions = function () {
      FeedManager.GetSubscriptionsForCurrentUser().then(function (response) {
        if (response.status == 200) {
          $scope.subscriptions = response.data;
          $scope.getError = null;
        } else {
          $scope.getError = {Message: "Error retrieving subscriptions: " + response.data.Message}
        }
      });
    };

    $scope.getUserSubscriptions();

    $scope.addFeed = function () {
      FeedManager.AddFeedForCurrentUser($scope.feed.url).then(function (response) {
        if (response.status == 200) {
          $scope.feed.title = response.data.title;
          $scope.feed.url = "";
          $scope.addError = null;
        } else {
          $scope.addError = {Message: "Could not add subscription: " + response.data.Message};
        }
      });
    };

    $scope.removeSubscription = function (feedUrl) {
      FeedManager.RemoveSubscriptionForCurrentUser(feedUrl).then(function (response) {
        if (response.status != 200) {
          $scope.removeError = {Message: "Error removing subscription " + response.data.Message};
        } else {
          $scope.clearRemoveError();
          KeyphraseManager.setSubscriptionBeingEdited(null);
        }
      });
    };

    $scope.editKeyphrasesForFeed = function (feed) {
      KeyphraseManager.setSubscriptionBeingEdited(feed);
      $location.path('/manageKeyphrases')
    };

    $scope.clearRemoveError = function () {
      $scope.removeError = null;
    };

  }]);

controllers.controller('CreateAccountCtrl', ['$scope', 'Authentication', '$location', function ($scope, Authentication, $location) {
  $scope.password = '';
  $scope.confirmPassword = '';
  $scope.smsPhone = false;
  $scope.smsTwitter = false;
  $scope.passwordsMatch = false;

  $scope.checkPasswords = function () {
    $scope.passwordsMatch = ($scope.password == $scope.confirmPassword);
  };

  $scope.createAccount = function () {
    if ($scope.smsPhone) {
      var phoneNumber = $scope.phoneNumber;
    }
    if ($scope.smsTwitter) {
      var twitterHandle = $scope.twitterHandle;
    }
    Authentication.createUser($scope.email, $scope.password, twitterHandle, phoneNumber).then(function (response) {
        if (response.status == 200) {
          $location.path('/manageSubscriptions');
        }
      })
  }

}]);


controllers.controller('ManageKeyphrasesCtrl', ['$scope', 'KeyphraseManager', 'keyphrases', function ($scope, KeyphraseManager, keyphrases) {
  $scope.keyphrases = keyphrases;

  $scope.editKeyphrase = function (keyphrase) {
    $scope.copyOfKeyphraseBeingEdited = $.extend({}, keyphrase);
    $scope.keyphraseBeingEdited = keyphrase;

  };

  $scope.addKeyphrase = function () {
    if ($scope.keyphrase != null) {
      KeyphraseManager.addKeyphrase($scope.keyphrase).then(function (response) {
        if (response.status == 200) {
          $scope.keyphrase = null;
          $scope.addError = null;
        }
      });
    } else {
      $scope.addError = {Message: "No keyphrase entered"}
    }
  };

  $scope.removeKeyphrase = function (keyphrase) {
    KeyphraseManager.removeKeyphrase(keyphrase).then(function (response) {
      if (response.status == 200) {
        if ($scope.keyphraseBeingEdited == keyphrase) {
          $scope.keyphraseBeingEdited = null;
        }
      }
    });
  };

  $scope.cancelEdit = function () {
    $scope.keyphraseBeingEdited = null;
  };

  $scope.saveEdit = function () {
    KeyphraseManager.editKeyphrase($scope.copyOfKeyphraseBeingEdited, $scope.keyphraseBeingEdited).then(function (response) {
      if (response.status == 200) {
        $scope.keyphraseBeingEdited = null;
        $scope.copyOfKeyphraseBeingEdited = null;
      }
    });
  }
}]);

controllers.controller('PopularFeedsCtrl', ['$scope', 'FeedManager',
  function ($scope, FeedManager) {
    $scope.popularFeeds = [];
    $scope.reverse = true;

    $scope.getPopularFeeds = function () {
      FeedManager.GetPopularFeeds().then(function (response) {
        if (response.status == 200) {
          $scope.popularFeeds = response.data;
          $scope.getError = null;
        } else {
          $scope.getError = {Message: "Error retrieving popular feeds: " + response.data.Message};
        }
      });
    };

    $scope.getPopularFeeds();
  }]);
