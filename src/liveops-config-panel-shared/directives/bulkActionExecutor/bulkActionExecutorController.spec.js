'use strict';

describe('bulkActionExecutorController', function () {
  var $scope,
    controller,
    mockBulkActions;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.bulkAction.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$rootScope', function ($rootScope) {
    $scope = $rootScope.$new();
  }]));

  beforeEach(inject(['$compile', '$controller', 'BulkAction', 'mockBulkActions', 'mockUsers',
    function ($compile, $controller, BulkAction, _mockBulkActions, mockUsers) {
      $scope.items = mockUsers;
      $scope.items[0].checked = true;
      $scope.items[1].checked = true;
      $scope.items[2].checked = false;

      controller = $controller('bulkActionExecutorController', {
        '$scope': $scope
      });
      mockBulkActions = _mockBulkActions;
    }
  ]));

  describe('ON register', function () {
    it('should add bulk action to $scope.bulkActions', function () {
      controller.register(mockBulkActions[0]);

      expect($scope.bulkActions).toBeDefined();
      expect($scope.bulkActions.length).toEqual(1);
    });
  });

  describe('ON deregister', function () {
    it('should add bulk action to $scope.bulkActions', function () {
      controller.register(mockBulkActions[0]);
      controller.deregister(mockBulkActions[0]);

      expect($scope.bulkActions).toBeDefined();
      expect($scope.bulkActions.length).toEqual(0);
    });
  });

  describe('ON execute', function () {
    beforeEach(function () {
      controller.register(mockBulkActions[0]);
      controller.register(mockBulkActions[1]);
    });

    it('should call execute for all checked items', inject([function () {
      controller.execute();

      expect($scope.bulkActions[0].execute).toHaveBeenCalledWith([
        $scope.items[0],
        $scope.items[1]
      ]);
      expect($scope.bulkActions[1].execute).not.toHaveBeenCalled();
    }]));

    it('should not call execute for unchecked bulkAction', inject([function () {
      controller.execute();

      expect($scope.bulkActions[1].execute).not.toHaveBeenCalled();
    }]));
  });

  describe('ON canExecute', function () {
    beforeEach(function () {
      controller.register(mockBulkActions[0]);
      controller.register(mockBulkActions[1]);
    });
    
    it('should return false if no bulkActions are checked', function () {
      $scope.bulkActions[0].checked = false;
      $scope.bulkActions[1].checked = false;

      $scope.bulkActions[0].canExecute = jasmine.createSpy();
      $scope.bulkActions[1].canExecute = jasmine.createSpy();

      var canExecute = controller.canExecute();

      expect(canExecute).toBeFalsy();
      expect($scope.bulkActions[0].canExecute).not.toHaveBeenCalled();
      expect($scope.bulkActions[1].canExecute).not.toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      $scope.bulkActions[0].checked = true;
      $scope.bulkActions[1].checked = true;

      $scope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      $scope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(false);

      var canExecute = controller.canExecute();

      expect(canExecute).toBeFalsy();
      expect($scope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect($scope.bulkActions[1].canExecute).toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      $scope.bulkActions[0].checked = true;
      $scope.bulkActions[1].checked = true;

      $scope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      $scope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(true);

      var canExecute = controller.canExecute();

      expect(canExecute).toBeTruthy();
      expect($scope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect($scope.bulkActions[1].canExecute).toHaveBeenCalled();
    });
  });

});