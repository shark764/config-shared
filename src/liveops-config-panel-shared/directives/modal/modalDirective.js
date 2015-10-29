'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('modal', [function () {
  return {
    restrict: 'E',
    templateUrl : 'liveops-config-panel-shared/directives/modal/modal.html'
  };
}]);
