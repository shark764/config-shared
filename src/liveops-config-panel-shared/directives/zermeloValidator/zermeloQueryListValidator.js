(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloQueryListValidator', ['ZermeloQueryList', 'jsedn',
      function (ZermeloQueryList, jsedn) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attr, ctrl) {

            function validateZermelo(input) {
              var queryList = null;

              try {
                queryList = ZermeloQueryList.fromEdn(input);
              } catch (e) {}

              ctrl.$setValidity('zermelo', !!queryList);

              return input;
            }

            ctrl.$parsers.unshift(validateZermelo);
            ctrl.$formatters.unshift(validateZermelo);
          }
        };
      }]);

})();
