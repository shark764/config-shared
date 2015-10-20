'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loading', [function() {
    return {
      restrict : 'E',
      templateUrl : 'app/shared/directives/loading/loading.html'
    };
  }]);
