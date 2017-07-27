'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('filterDropdown', ['$filter', '$rootScope', function ($filter, $rootScope) {
    /** filter-dropdown element directive
     * Generate a dropdown menu with checkboxes to select/deselect items
     *
     * Supported option config is as follows:
     * - checked (boolean): Optional boolean to set the initial checked state of the item. Defaults to true
     *
     * An option item can also be a function that returns the display value when passed to the 'invoke' filter
     *
     * Listen for 'dropdown:item:checked' event, thrown when a menu item is checked or unchecked
     */
    return {
      scope: {
        id: '@',
        options: '=', // (array) The list of config objects for items to be shown in the menu.
        valuePath: '@', // (string) The property path to be used as the checkbox's model for menu items. Defaults to 'value'
        displayPath: '@', // (string) The property path to be used as the label for menu items. Defaults to 'display'
        label: '@', // (string) The text of the menu's label/title
        showAll: '@', // (boolean) Whether to show the 'All' checkbox option
        orderBy: '@', // (string) The item property to be used to sort the menu items. Defaults to 'label'
        all: '=?', // (object) Exposes the 'All' checkbox option. all.checked reveals the 'All' checbox state
        bypassFilter: '='
      },
      templateUrl: 'liveops-config-panel-shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope, element) {
        if ($scope.bypassFilter) {
          $scope.all = undefined;
          $scope.showAll = undefined;
        }

        element.parent().css('overflow', 'visible');

        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';

        $scope.checkItem = function (option) {
          option.checked = !option.checked;

          $scope.$emit('dropdown:item:checked', option);
        };

        if ($scope.showAll) {
          var checkAll = function(){
            angular.forEach($scope.options, function (option) {
              option.checked = true;
            });
          };

          var uncheckAll = function(){
            angular.forEach($scope.options, function (option) {
              option.checked = false;
            });
          };

          // If 'all' was checked but some other option has been unchecked, uncheck 'all' option
          // If 'all' was unchecked but all other options are checked, check 'all' option
          $scope.$watch('options', function (newList, oldList) {

            $rootScope.$broadcast('filtersChanged');
            var checkedOptions = $filter('filter')($scope.options, {checked: true}, true);

            if ($scope.all) {
              if ($scope.all.checked && (newList.length > oldList.length)){
                // If a new item was added to the options list, while the 'All' option is selected,
                // we make sure it is checked
                checkAll();
              } else if (checkedOptions.length === $scope.options.length ) {
                $scope.all.checked = true;
              } else {
                $scope.all.checked = false;
              }
            }
          }, true);

          $scope.toggleAll = function(){
            $scope.all.checked = !$scope.all.checked;
            $scope.$emit('dropdown:item:checkedUncheckedAll', {checked: $scope.all.checked});

            if ($scope.all.checked) {
              checkAll();
            } else {
              uncheckAll();
            }
          };

          var checkAllByDefault = true;
          angular.forEach($scope.options, function (option) {
            checkAllByDefault = checkAllByDefault && (angular.isUndefined(option.checked) ? true : option.checked);
          });
          $scope.all = {
            checked: checkAllByDefault
          };
          if (checkAllByDefault){
            checkAll();
          }

        } else {
          $scope.$watch('options', function () {
            angular.forEach($scope.options, function (option) {
              option.checked = angular.isUndefined(option.checked) ? true : option.checked;
            });
          });
        }
      }
    };
  }]);
