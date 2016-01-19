'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmitSpinner', [function() {
    /** lo-submit-spinner attribute directive
     * Show a loading spinner in place of the (button-tyled) element when the given expression is truthy
     */
    return {
      restrict: 'A',
      scope : {
        loSubmitSpinnerStatus: '&' // (expression) When true, the spinner is shown and the element is hidden. When false, spinner is hidden and element is shown
      },
      link: function($scope, ele) {
        $scope.spinnerElement = angular.element('<a disabled="true"><i class="fa fa-refresh fa-spin"></i></a>');
        $scope.spinnerElement.addClass(ele[0].className);
        $scope.spinnerElement.addClass('ng-hide');
        ele.after($scope.spinnerElement);

        $scope.$watch('loSubmitSpinnerStatus()', function (val) {
          if (angular.isDefined(val)) {
            ele.toggleClass('ng-hide', val);
            $scope.spinnerElement.toggleClass('ng-hide', !val);
          }
        });
      }
    };
   }]);
