'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('toggle', [function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '=',
        name: '@',
        trueValue: '@',
        falseValue: '@',
        confirmEnableMessage: '@',
        confirmDisableMessage: '@',
        onConfirm: '&'
      },
      controller: function ($scope) {
        if (angular.isUndefined($scope.trueValue)){
          $scope.trueValue = true;
        }

        if(angular.isUndefined($scope.falseValue)) {
          $scope.falseValue = false;
        }

        if (angular.isDefined($scope.confirmEnableMessage) && angular.isDefined($scope.confirmDisableMessage)){
          $scope.confirmOnToggle = true;
        }
      }
    };
   }]);