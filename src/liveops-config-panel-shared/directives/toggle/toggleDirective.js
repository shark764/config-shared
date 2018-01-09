'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('toggle', [function() {
    /** toggle element directive
     * Generate a two-state switch element
     */

    //TODO: move confirmEnableMessage, confirmDisableMessage, and onConfirm to confirmToggle
    return {
      templateUrl : 'liveops-config-panel-shared/directives/toggle/toggle.html',
      restrict: 'E',
      require: 'ngModel',
      scope : {
        ngModel : '=', // (ngModel) The model the toggle should be bound to
        ngDisabled : '=', // (expression) Whether the toggle should be disabled
        name: '@', // (string) HTML name attribute for the element
        trueValue: '@', // (string/primitive) Value for the model when the toggle is switched on. Default is boolean true
        falseValue: '@', // (string/primitive) Value for the model when the toggle is switched off. Default is boolean false
        confirmEnableMessage: '@', // (string) Optional translation key for the confirm message shown when toggling on
        confirmDisableMessage: '@', // (string) Optional translation key for the confirm message shown when toggling off
        onConfirm: '&', // (expression) Optional expression to execute when the user confirms the toggle. If user cancels, nothing happens.
        title: '@' // (string) this is text for the title popup which shows up on mouseover
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
