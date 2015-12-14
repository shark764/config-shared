(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('queryListCreator', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalationList/escalationListEditor.html',
        controller: 'EscalationListEditorController as qlc',
        scope: {
          queryString: '=',
          form: '='
        }
      };
    });

})();
