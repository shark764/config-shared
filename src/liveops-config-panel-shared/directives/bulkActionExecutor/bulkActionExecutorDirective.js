'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('bulkActionExecutor', ['$q', 'Alert', 'Modal', '$translate', 'DirtyForms', '$filter',
    function ($q, Alert, Modal, $translate, DirtyForms, $filter) {
      return {
        restrict: 'E',
        scope: {
          items: '=',
          showBulkActions: '=',
          dropOrderBy: '@',
          confirmMessageKey: '@'
        },
        transclude: true,
        templateUrl: 'liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        controller: 'bulkActionExecutorController',
        link: function ($scope, elem, attrs, controller, transclude) {

          $scope.confirmExecute = function () {
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant($scope.confirmMessageKey, {
                numItems: $scope.selectedItems().length
              }),
              okCallback: $scope.execute
            });
          };

          $scope.closeBulk = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.$emit('details:panel:close');
            });
          };

          $scope.selectedItems = function () {
            $scope.checkedItems.clear();
            angular.forEach($scope.items, function (item) {
              if (item.checked) {
                $scope.checkedItems.push(item);
              }
            });
            
            if ($scope.dropOrderBy) {
              //Reorder elements while preserving original object reference to avoid infinite digest loop
              var sorted = $filter('orderBy')($scope.checkedItems, $scope.dropOrderBy);
              $scope.checkedItems.clear();
              $scope.checkedItems.push.apply($scope.checkedItems, sorted);
            }

            return $scope.checkedItems;
          };

          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              if ($scope.bulkActionForm.$dirty) {
                $scope.resetForm();
              } else {
                $scope.closeBulk();
              }
            });
          };

          $scope.resetForm = function () {
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            angular.forEach(controller.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

          transclude($scope.$parent, function (clone) {
            elem.find('.detail-body').append(clone);
          });

          if (!$scope.confirmMessageKey) {
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }

          $scope.checkedItems = [];

          $scope.$watch('showBulkActions', function (newValue) {
            if (!newValue) {
              $scope.resetForm();
            }
          });
          
          $scope.execute = controller.execute;
          $scope.canExecute = controller.canExecute;
        }
      };
    }
  ]);