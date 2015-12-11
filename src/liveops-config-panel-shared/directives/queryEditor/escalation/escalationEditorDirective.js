(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('escalationEditor', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalation/escalationEditor.html',
        controller: 'EscalationEditorController as ec',
        scope: {
          escalation: '=',
          previousEscalation: '=',
          minSeconds: '='
        }
      };
    });

})();
