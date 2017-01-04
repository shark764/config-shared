(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloQueryValidator', ['ZermeloQuery',
      function (ZermeloQuery) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attr, ctrl) {

            function validateZermelo(input) {
              var query = null;

              try {
                query = ZermeloQuery.fromEdn(input);
              } catch (e) {}

              ctrl.$setValidity('zermelo', !!query);

              return input;
            }

            ctrl.$parsers.unshift(validateZermelo);
            ctrl.$formatters.unshift(validateZermelo);
          }
        };
      }]);

})();
