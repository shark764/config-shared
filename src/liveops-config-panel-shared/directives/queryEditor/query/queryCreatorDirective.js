(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('queryCreator', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/query/queryCreator.html',
        controller: 'QueryCreatorController as qc',
        scope: {
          query: '='
        }
      };
    }

})();
