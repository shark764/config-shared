'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('bulkActionExecutorController', ['$scope', '$filter', '$q', 'toArrayFilter',
    function ($scope, $filter, $q, toArrayFilter) {
      var self = this;
      $scope.bulkActions = [];

      this.register = function register(bulkAction) {
        $scope.bulkActions.push(bulkAction);
      };

      this.deregister = function register(bulkAction) {
        $scope.bulkActions.removeItem(bulkAction);
      };

      this.getCheckedItems = function (items) {
        return $filter('filter')(toArrayFilter(items), {
          checked: true
        });
      };

      this.getAffected = function getAffected() {
        var checkedItems = self.getCheckedItems($scope.items);
        var checkedBulkActions = self.getCheckedItems($scope.bulkActions);

        var affectedItems = [];

        angular.forEach(checkedItems, function(item) {
          angular.forEach(checkedBulkActions, function(bulkAction) {
            if(bulkAction.doesQualify(item)) {
              affectedItems.push(item);
            }
          });

        });

        return affectedItems;
      };

      this.execute = function execute() {
        $scope.executing = true;
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        var itemPromises = [];

        angular.forEach(selectedBulkActions, function (bulkAction) {
          if (bulkAction.canExecute()) {
            var selectedItems = self.getCheckedItems($scope.items);
            itemPromises.push($q.when(bulkAction.execute(selectedItems)));
          }
        });

        return $q.all(itemPromises).finally(function(){
          $scope.executing = false;
        });
      };

      this.canExecute = function canExecute () {
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);

        var canExecute = !!selectedBulkActions.length;

        if(canExecute && !!self.getAffected().length){
          angular.forEach(selectedBulkActions, function (bulkAction) {
            canExecute = canExecute && bulkAction.canExecute();
          });
        }

        return canExecute;
      };
    }
  ]);
