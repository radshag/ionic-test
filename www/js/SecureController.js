(function () {

  angular.module('starter.controllers')
    .controller('SecureController', controllerFnc)
    .factory('Users', function ($firebaseArray, FBURL, $window) {
      var ref = new $window.Firebase(FBURL + 'users');
      return $firebaseArray(ref);
    })
    .factory('FB', function ($firebaseArray, FBURL, $window) {
      return new $window.Firebase(FBURL);
    })


  function controllerFnc($scope, $ionicPlatform, Auth, $state, $ionicHistory, FB, Users, $firebaseObject, $firebaseArray, $cordovaCamera) {

    $ionicHistory.clearHistory();
    $scope.images = [];
    var syncArray;

    // Check for the user's authentication state
    Auth.$onAuth(function (authData) {
      if (authData) {
        var userRef = FB.child('users/' + authData.uid);
        syncArray = $firebaseArray(userRef.child('images'));
        $scope.images = syncArray;
      } else {
        $state.go('firebase');
      }
    });

    //var fbAuth = Auth.getAuth();
    //if (fbAuth) {
    //  var userRef = Auth.child('users/' + fbAuth.uid);
    //  var syncArray = $firebaseArray(userRef.child('images'));
    //  $scope.images = syncArray;
    //} else {
    //  $state.go('firebase');
    //}

    $ionicPlatform.ready(function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $scope.takePicture = function () {
        $log.log("taking picture");
        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            syncArray.$add({image: imageData})
              .then(function () {
                alert('image saved');
              })
          }, function (err) {
            // error
            $log.log("can't take picture");
          });
      }

    });

  }

})()
