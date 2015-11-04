'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('bulkActionExecutorController', ['$scope', '$filter', '$q', '$translate',
    function ($scope, $filter, $q, $translate) {
      var self = this;
      $scope.bulkActions = [];

      this.register = function register(bulkAction) {
        $scope.bulkActions.push(bulkAction);
      };

      this.deregister = function register(bulkAction) {
        $scope.bulkActions.removeItem(bulkAction);
      };
      
      this.getCheckedItems = function (items) {
        return $filter('filter')(items, {
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
          })
          
        });
        
        return affectedItems;
      };
      
      this.execute = function execute() {
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        var itemPromises = [];
        
        angular.forEach(selectedBulkActions, function (bulkAction) {
          if (bulkAction.canExecute()) {
            var selectedItems = self.getCheckedItems($scope.items);
            itemPromises.push($q.when(bulkAction.execute(selectedItems)));
          }
        });

        return  $q.all(itemPromises);
      };
      
      this.canExecute = function canExecute () {
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        
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