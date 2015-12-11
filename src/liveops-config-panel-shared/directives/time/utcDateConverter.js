'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('utcDateConverter', ['$moment',
    function ($moment) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
          ngModel.$parsers.push(function(value) {
            if(!value) {
              return value;
            }
            
            return $moment.utc([value.getFullYear(), value.getMonth(), value.getDate()]);
          });
          
          ngModel.$formatters.push(function(value) {
            if(!value) {
              return value;
            }
            
            return value.toDate();
          });
        }
      };
    }
  ]);
