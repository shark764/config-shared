'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('bulkActionExecutor', ['$q', 'Alert', 'Modal', '$translate', 'DirtyForms', '$filter', 'toArrayFilter',
    function ($q, Alert, Modal, $translate, DirtyForms, $filter, toArrayFilter) {
    /** bulk-action-executor element directive
     * Generate the bulk actions panel. This directive uses transclusion to provide the panel content
     */
      return {
        restrict: 'E',
        scope: {
          items: '=', // (array) List of items from the table
          showBulkActions: '=', // (boolean) Used for tracking whether or not to show the bulk actions panel. Set to false when panel is closed by user
          dropOrderBy: '@', // (string) The item property used to sort the dropdown list of items that are selected for editing
          confirmMessageKey: '@' // (string) Translation key for the confirm dialog message displayed to the user when they submit
        },
        transclude: true,
        templateUrl: 'liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        controller: 'bulkActionExecutorController',
        link: function ($scope, elem, attrs, controller, transclude) {
          transclude($scope.$parent, function (clone) {
            elem.find('.detail-body').append(clone);
          });

          if (!$scope.confirmMessageKey) {
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }

          $scope.checkedItems = [];

          $scope.confirmExecute = function () {
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant($scope.confirmMessageKey, {
                numItems: controller.getAffected().length
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
            //Preserve the binding to checkedItems, but update the array contents
            $scope.checkedItems.clear();
            $scope.checkedItems.push.apply($scope.checkedItems, controller.getCheckedItems($scope.items));

            if ($scope.dropOrderBy) {
              //Reorder elements while preserving original object reference to avoid infinite digest loop
              var sorted = $filter('orderBy')(toArrayFilter($scope.checkedItems), $scope.dropOrderBy);

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
            angular.forEach($scope.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

          $scope.$watch('showBulkActions', function (newValue) {
            if (!newValue) {
              $scope.resetForm();
            }
          });

          $scope.execute = function execute() {
            //Prevent unsaved changes warning from triggering if all items are
            //filtered out of the table and the bulk actions panel auto-closes
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();

            return controller.execute().then(function () {
              Alert.success($translate.instant('bulkAction.success'));
              $scope.resetForm();
            }, function() {
              Alert.error($translate.instant('bulkAction.fail'));
            });
          };

          $scope.canExecute = controller.canExecute;
        }
      };
    }
  ]);
