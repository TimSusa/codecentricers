'use strict';

describe('SiteCtrl', function() {

  beforeEach(module('codecentricers'));
  beforeEach(module('codecentricers.resources'));
  beforeEach(module('codecentricers.templates.html'));

  var ctrl;
  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('SiteCtrl', { $scope: scope });
  }));

  it('should toogle the provider', function() {
    expect(3).toBe(3);
  });
});
