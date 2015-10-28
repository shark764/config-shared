'use strict';

describe('ngResource directive', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    $scope.ngResource = {};

    element = $compile('<div ng-resource="ngResource"></div>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should do something someday', function() {});
});
