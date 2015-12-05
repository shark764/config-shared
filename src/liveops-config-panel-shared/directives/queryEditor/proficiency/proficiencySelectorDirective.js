(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('proficiencySelector', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/proficiency/proficiencySelector.html',
        scope: {
          operator: '=',
          proficiency: '='
        }
      };
    }

})();
