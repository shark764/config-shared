'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loDuplicateValidator', ['_', function(_) {
    return {
      restrict : 'A',
      require: 'ngModel',
      scope: {
        loDuplicateValidatorItems: '=',
        loDuplicateValidatorOptions: '='
      },
      link: function ($scope, elem, attr, ngModelCtrl) {
        ngModelCtrl.$validators.duplicate = function (modelValue, viewValue) {
          var comparer = $scope.loDuplicateValidatorOptions.comparer || function(item) {
            return item === value;
          };

          var value = modelValue;

          return _.filter($scope.loDuplicateValidatorItems, comparer).length === 0 ;
        };
      }
    };
  }]);
