'use strict';
/**
 * @ngdoc directive
 * @name codecentricers.directives:clusterStatesView
 * @module codecentricers
 * @kind controller
 *
 * @description
 *
 */
angular.module('codecentricers')
.directive('basicClick', function($parse) {
  return {
    compile: function(elem, attr) {
      var fn = $parse(attr.basicClick);
      return function(scope, elem) {
        elem.on('click', function(e) {
          fn(scope, { $event: e });
          scope.$apply();
        });
      };
    }
  };
});
