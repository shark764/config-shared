'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loDuplicateValidator', ['_', function(_) {
    /** lo-duplicate-validator attribute directive
     * Add a 'duplicate' validator to an ngModel to make sure the ngModel doesn't duplicate an existing item
     *
     * By default it will compare the ngModel value to the given list of items, marking the ngModel as invalid if it finds a match
     * Optionally supply a custom comparer function, which will be passed to lodash filter()
     */
    return {
      restrict : 'A',
      require: 'ngModel',
      scope: {
        loDuplicateValidatorItems: '=', // (array) List of items to compare the ngModel to
        loDuplicateValidatorOptions: '=' // (object) Optionally supply a custom comparator function by loDuplicateValidatorOptions.comparer
      },
      link: function ($scope, elem, attr, ngModelCtrl) {
        ngModelCtrl.$validators.duplicate = function (modelValue, viewValue) {
          var comparer = $scope.loDuplicateValidatorOptions.comparer || function(item) {
            return item === modelValue;
          };

          var obj = {
            modelValue: modelValue,
            viewValue: viewValue
          };

          return _.filter($scope.loDuplicateValidatorItems, comparer, obj).length === 0 ;
        };
      }
    };
  }]);
