'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editField', function () {
    return {
      restrict: 'E',
      templateUrl: 'liveops-config-panel-shared/directives/editField/input/editField_input.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        name: '@',
        label: '@',
        type: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });
