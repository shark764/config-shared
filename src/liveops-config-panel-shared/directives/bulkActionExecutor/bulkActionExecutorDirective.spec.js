'use strict';

describe('bulkActionExecutor directive', function () {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.bulkAction.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$rootScope', function ($rootScope) {
    $scope = $rootScope.$new();
  }]));

  beforeEach(inject(['$compile', 'BulkAction', 'mockBulkActions', 'mockUsers',
    function ($compile, BulkAction, mockBulkActions, mockUsers) {
      $scope.items = mockUsers;
      $scope.items[0].checked = true;
      $scope.items[1].checked = true;
      $scope.items[2].checked = false;

      $scope.bulkActions = mockBulkActions;
      $scope.showBulkActions = true;

      var element = $compile('<bulk-action-executor items="items" bulk-actions="bulkActions" show-bulk-actions="showBulkActions"></bulk-action-executor>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  describe('ON execute', function() {
    it('should call Alert when all promises resolve', inject(['$httpBackend', 'Alert',
      function ($httpBackend, Alert) {
        spyOn(Alert, 'success');

        isolateScope.execute();
        isolateScope.$digest();
        expect(Alert.success).toHaveBeenCalled();
      }
    ]));
  });
  
  describe('ON selectedItems', function () {
    it('should return all checked items', function() {
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems.length).toEqual(2);
    });

    it('should never break the $scope.checkedItems reference', function() {
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems).toBe(checkedItems);
    });

    it('should return items in order, if given dropOrderBy', function() {
      $scope.items[0].sortField = 2;
      $scope.items[1].sortField = 1;
      $scope.items[2].sortField = 3;
      isolateScope.dropOrderBy = 'sortField';
      var checkedItems = isolateScope.selectedItems();

      expect(checkedItems[0]).toBe($scope.items[1]);
      expect(checkedItems[1]).toBe($scope.items[0]);
    });
  });

  describe('showBulkActions watch', function () {
    it('should call reset form is showBulkActions becomes false', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = false;
      isolateScope.$digest();

      expect(isolateScope.resetForm).toHaveBeenCalled();
    });

    it('should not reset the form if showBulkActions becomes true', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = true;
      isolateScope.$digest();

      expect(isolateScope.resetForm).not.toHaveBeenCalled();
    });
  });
});
