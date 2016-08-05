'use strict';
/**
 * @ngdoc directive
 * @name codecentricers.directives:UserNav
 * @module codecentricers
 * @kind directive
 *
 * @description
 * Directive for top-level navigation.
 *
 * Exposes the {@link codecentricers.controller:UserNavCtrl UserNavCtrl} controller as `nav` to the scope
 * which exports the
 * following objects
 *
 * * `langs` - `{Array<string>}` - supported translation language keys
 * * `user` - `{object}` - User object when logged in
 *
 */

angular.module('codecentricers')
.directive('userNav', function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      userNav: '@userNav'
    },
    controller: 'UserNavCtrl',
    controllerAs: 'nav',
    templateUrl: 'directives/userNav.html',
  };
})

/**
 * @ngdoc controller
 * @name codecentricers.controller:UserNavCtrl
 * @module codecentricers
 * @kind controller
 * @requires codecentricers.objects:globals
 *
 * @description
 * Controller for top-level navigation.
 *
 */
.controller('UserNavCtrl', [ '$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var $location        = $injector.get('$location');
  var globals          = $injector.get('globals');

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // 4 Expose methods and properties on the controller instance
  this.is = is;
  this.switchCaret = switchCaret;
  this.menuNav = globals.menuNav;
  this.isToggled = true;

  var menuIcons = [
    '/assets/images/menu/menu-bars-2.svg',
    '/assets/images/menu/menu-close.svg'
  ];

  this.minCaret = [];
  this.menuIcon = menuIcons[0];
  this.getIcon = getIcon;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  // 6. All the actual implementation goes here

  /**
    * @ngdoc method
    * @name codecentricers.controller:UserNavCtrl#is
    * @methodOf codecentricers.controller:UserNavCtrl
    * @kind function
    *
    * @description
    * Check the current URL path obtained from `$location` matches a segment.
    * This is useful to set CSS active class on navigation elements.
    *
    * @param {String} segment String to compare against a url segment.
    * @param {Number} pos     Position in the URL path to compare, default: 1, When 0
    *                         matches `segment` against the entire URL path.
    *
    * @returns {boolean}  True if the current route contains the string.
    */
  function is (segment, pos) {
    var url = $location.path();
    if (!pos) {
      return url === segment;
    }
    var ret = url.split('/')[pos || 1] === segment;
    // Note: splitting /user/dashboard results in ['','user','dashboard']
    return ret;
  }

  function getIcon ( ) {
    if ( controller.isToggled ) {
      controller.menuIcon = menuIcons[0];
    } else {
      controller.menuIcon = menuIcons[1];
    }
    return controller.menuIcon;
  }

  function switchCaret ( idx ) {
    for(var i = 0; i <= controller.menuNav.main.length;i++){
      if (idx !== i) {
        controller.minCaret[i] = false;
      }

    }
    controller.minCaret[idx] = !controller.minCaret[idx];
  }
}]);

