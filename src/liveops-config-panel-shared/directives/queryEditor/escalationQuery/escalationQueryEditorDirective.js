(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('escalationQueryEditor', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalationQuery/escalationQueryEditor.html',
        controller: 'EscalationQueryEditorController as eqc',
        scope: {
          escalationQuery: '='
        }
      };
    });

})();
