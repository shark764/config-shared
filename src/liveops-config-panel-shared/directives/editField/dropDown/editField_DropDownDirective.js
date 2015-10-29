'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editFieldDropDown', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'liveops-config-panel-shared/directives/editField/dropDown/editField_DropDown.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        defaultText: '@',
        name: '@',
        label: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });