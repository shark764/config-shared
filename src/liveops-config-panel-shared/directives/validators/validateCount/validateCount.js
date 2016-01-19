'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('validateCount', [function () {
    /** validate-count attribute directive
     * Add a validateCount validator to an ngModel. Verifies that the model is a non-empty array.
     */
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ngModel) {
        $scope.$watchCollection(attrs.ngModel, function (newCollection) {
          if(newCollection) {
            ngModel.$setValidity(attrs.name, !!newCollection.length);
          } else {
            ngModel.$setValidity(attrs.name, false);
          }
        });
      }
    };
  }]);
