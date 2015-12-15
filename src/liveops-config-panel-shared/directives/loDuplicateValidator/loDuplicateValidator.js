'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loDuplicateValidator', ['_', function(_) {
    return {
      restrict : 'A',
      require: 'ngModel',
      scope: {
        loDuplicateValidatorItems: '=',
        loDuplicateValidatorField: '=',
        loDuplicateValidatorValueTransfomer: '&'
      },
      link: function ($scope, elem, attr, ngModelCtrl) {
        ngModelCtrl.$validators.duplicate = function (modelValue, viewValue) {
          var value = modelValue,
              items = $scope.loDuplicateValidatorItems;

          if(attr.loDuplicateValidatorField) {
            items = _.pluck(items, attr.loDuplicateValidatorField);
          }

          return _.includes(items, $scope.loDuplicateValidatorValueTransfomer(value));
        };
      }
    };
  }]);
