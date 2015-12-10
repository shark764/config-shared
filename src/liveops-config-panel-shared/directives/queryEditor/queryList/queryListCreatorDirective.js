(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('queryListCreator', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/queryList/queryListCreator.html',
        controller: 'QueryListCreatorController as qlc',
        scope: {
          queryString: '='
        }
      };
    });

})();
