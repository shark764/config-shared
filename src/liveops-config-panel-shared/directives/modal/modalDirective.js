'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('modal', [function () {
  return {
    restrict: 'E',
    templateUrl : 'app/shared/directives/modal/modal.html'
  };
}]);