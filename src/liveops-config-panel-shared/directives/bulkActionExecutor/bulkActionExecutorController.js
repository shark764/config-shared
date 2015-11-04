'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('bulkActionExecutorController', ['$scope', '$filter', '$q', '$translate', 'Alert',
    function ($scope, $filter, $q, $translate, Alert) {
      var self = this;
      this.bulkActions = [];

      this.register = function register(bulkAction) {
        self.bulkActions.push(bulkAction);
      };

      this.deregister = function register(bulkAction) {
        self.bulkActions.removeItem(bulkAction);
      };
      
      this.getCheckedItems = function (items) {
        return $filter('filter')(items, {
          checked: true
        });
      };
      
      this.getAffected = function getAffected() {
        var checkedItems = self.getCheckedItems($scope.items);
        var checkedBulkActions = self.getCheckedItems(self.bulkActions);
        
        var affectedItems = [];
        
        angular.forEach(checkedItems, function(item) {
          angular.forEach(checkedBulkActions, function(bulkAction) {
            if(bulkAction.doesQualify(item)) {
              affectedItems.push(item);
            }
          })
          
        });
        
        return affectedItems;
      };
      
      this.execute = function execute() {
        var selectedBulkActions = self.getCheckedItems(self.bulkActions);
        var itemPromises = [];

        //Prevent unsaved changes warning from triggering if all items are
        //filtered out of the table and the bulk actions panel auto-closes
        $scope.bulkActionForm.$setUntouched();
        $scope.bulkActionForm.$setPristine();

        angular.forEach(selectedBulkActions, function (bulkAction) {
          if (bulkAction.canExecute()) {
            var selectedItems = self.getCheckedItems($scope.items);
            itemPromises.push($q.when(bulkAction.execute(selectedItems)));
          }
        });

        var promise = $q.all(itemPromises).then(function () {
          Alert.success($translate.instant('bulkAction.success'));
          $scope.resetForm();
        });

        return promise;
      };
      
      this.canExecute = function canExecute () {
        var selectedBulkActions = self.getCheckedItems(self.bulkActions);
        
        var canExecute = !!selectedBulkActions.length;
        
        if(canExecute = canExecute && !!self.getAffected().length){
          angular.forEach(selectedBulkActions, function (bulkAction) {
            canExecute = canExecute && bulkAction.canExecute();
          });
        }
        
        return canExecute;
      };
    }
  ]);