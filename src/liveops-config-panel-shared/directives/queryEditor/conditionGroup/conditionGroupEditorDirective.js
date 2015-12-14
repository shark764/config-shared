(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('conditionGroupEditor', function() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/conditionGroup/conditionGroupEditor.html',
        controller: 'ConditionGroupEditorController as cqe',
        scope: {
          conditionGroup: '=',
          items: '=',
          sectionLabel: '@',
          placeholderText: '@',
          readonly: '='
        }
      };
    });
 
})();
