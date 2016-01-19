'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('modal', [function () {
  /** modal element directive
   * A container for a modal
   * 
   * The value of modalBody on the $scope will be ng-included as the contents of the modal.
   * (Note that this directive does not have an isolated scope.)
   * You can use $compile to create a new modal with a specific scope and insert it into the document
   * See the modal service for an example
   */
  return {
    restrict: 'E',
    templateUrl : 'liveops-config-panel-shared/directives/modal/modal.html'
  };
}]);
