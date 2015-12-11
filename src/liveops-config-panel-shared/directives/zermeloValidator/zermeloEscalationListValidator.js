(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloEscalationListValidator', ['ZermeloEscalationList', 'jsedn',
      function (ZermeloEscalationList, jsedn) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attr, ctrl) {

            function validateZermelo(input) {
              var queryList = null;

              try {
                queryList = ZermeloEscalationList.fromEdn(input);
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
