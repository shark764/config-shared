'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('filterDropdown', ['$filter', function ($filter) {
    return {
      scope: {
        id: '@',
        options: '=',
        valuePath: '@',
        displayPath: '@',
        label: '@',
        showAll: '@',
        orderBy: '@'
      },
      templateUrl: 'liveops-config-panel-shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope, element) {
        element.parent().css('overflow', 'visible');

        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';
        
        $scope.checkItem = function (option) {
          option.checked = !option.checked;

          $scope.$emit('dropdown:item:checked', option);
        };

        if ($scope.showAll) {

          // If 'all' was checked but some other option has been unchecked, uncheck 'all' option
          // If 'all' was unchecked but all other options are checked, check 'all' option
          $scope.$watch('options', function () {
            var checkedOptions = $filter('filter')($scope.options, {checked: true}, true);

            if (checkedOptions.length === $scope.options.length ) {
              $scope.all.checked = true;
            } else {
              $scope.all.checked = false;
            }
          }, true);
          
          $scope.toggleAll = function(){
            $scope.all.checked = !$scope.all.checked;
            
            if ($scope.all.checked) {
              checkAll();
            }
          };
          
          var checkAll = function(){
            angular.forEach($scope.options, function (option) {
              option.checked = true;
            });
          };
          
          var checkAllByDefault = true;
          angular.forEach($scope.options, function (option) {
            checkAllByDefault = checkAllByDefault && (typeof option.checked === 'undefined' ? true : option.checked);
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
              option.checked = (typeof option.checked === 'undefined' ? true : option.checked);
            });
          });
        }
      }
    };
  }]);
