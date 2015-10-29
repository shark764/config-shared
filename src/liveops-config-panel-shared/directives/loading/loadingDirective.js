'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loading', [function() {
    return {
      restrict : 'E',
      templateUrl : 'liveops-config-panel-shared/directives/loading/loading.html'
    };
  }]);
