(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloQueryValidator', ZermeloQueryValidator);

    function ZermeloQueryValidator(ZermeloQuery, jsedn) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attr, ctrl) {

          function validateZermelo(input) {
            // if fromEdn returns null; set validity to false
            ctrl.$setValidity('zermelo', !!ZermeloQuery.fromEdn(input));

            return input;
          }

          ctrl.$parsers.unshift(validateZermelo);
          ctrl.$formatters.unshift(validateZermelo);
        }
      };
    }

})();
