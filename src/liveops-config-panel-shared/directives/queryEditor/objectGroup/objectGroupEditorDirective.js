(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('objectGroupEditor', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/objectGroup/objectGroupEditor.html',
        controller: 'ObjectGroupEditorController as oge',
        scope: {
          objectGroup: '=',
          key: '=',
          readonly: '='
        }
      };
    }

})();
