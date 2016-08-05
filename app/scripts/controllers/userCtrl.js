'use strict';
/**
 * @ngdoc controller
 * @name codecentricers.controller:UserCtrl
 * @module codecentricers
 * @kind controller
 * @requires $log
 * @requires $q
 * @requires codecentricers.objects:globals
 *
 * @description
 * Controller for managing user-related actions like login, email, password and user lifecycle.
 *
 */
angular.module('codecentricers')
.controller('UserCtrl', [ '$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var $location        = $injector.get('$location');
  var globals          = $injector.get('globals');
  var $log = $injector.get('$log');
  var log = globals.debug ? angular.bind(null, $log.debug, 'C[UserCtrl]') : angular.noop;

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // login session expired for some reason
  $scope.$on('login.expired', init);

  // login was successful
  $scope.$on('login.success', init);

  // 4 Expose methods and properties on the controller instance
  this.data = {}; // name, password
  this.willRedirect = !!$location.search().redirectTo;
  this.usernamePolicy = new RegExp(globals.usernamePolicy);
  this.passwordPolicy = new RegExp(globals.passwordPolicy);

  this.user = null;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  init();

  // 6. All the actual implementation goes here
  function init () {

    log('init()');
    controller.data = {};

  }
}]);
