'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('uuid', [function () {
    /** uuid attribute directive
     * Add a uuid validator to an ngModel. Verifies that an ngModel is a valid UUID
     */
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ctrl) {
        ctrl.$validators.uuid = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid - required will catch it if it's not
            return true;
          }
          
          //regex from http://stackoverflow.com/a/13653180
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(viewValue)) {
            return true;
          }

          return false;
        };
      }
    };
  }]);
