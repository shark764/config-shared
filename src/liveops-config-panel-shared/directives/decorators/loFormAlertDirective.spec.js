'use strict';

describe('loFormAlert directive', function() {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope',
    function($compile, $rootScope) {
      $scope = $rootScope.$new();

      $scope.ngResource = {
        isNew: jasmine.createSpy('ngResource.isNew'),
        reset: jasmine.createSpy('ngResource.reset'),
        email: 'test@tester.com'
      };

      var element = angular.element('<div><ng-form name="form1" lo-form-submit="chain1" lo-form-cancel="" ng-resource="ngResource" lo-form-alert></ng-form></div>');
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();
    }
  ]));

  beforeEach(inject(['Alert', function(Alert) {
    spyOn(Alert, 'success');
    spyOn(Alert, 'error');
  }]));

  describe('ON form:submit:success', function() {
    it('should alert with a success message for create', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:success', {
        updated: false
      });

      expect(Alert.success).toHaveBeenCalledWith('Record saved');
    }]));

    it('should alert with a success message for update', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:success', {
        updated: true
      });

      expect(Alert.success).toHaveBeenCalledWith('Record updated');
    }]));
  });

  describe('ON form:submit:failure', function() {
    it('should alert with a failure message', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:failure', {
        updated: false
      });
      expect(Alert.error).toHaveBeenCalledWith('Record failed to save');
    }]));

    it('should alert with a failure message', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:failure', {
        updated: true
      });
      expect(Alert.error).toHaveBeenCalledWith('Record failed to update');
    }]));
  });

});
