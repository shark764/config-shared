'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('dateToMinuteConverter', [function () {
    return {
      require: 'ngModel',
      link: function ($scope, elem, attr, ngModel) {
        ngModel.$formatters.push(function(value) {
          if(value === -1) {
            return null;
          } else if(angular.isNumber(value)) {
            return new Date(0,0,0,0,value,0,0);
          }

          return value;
        });

        ngModel.$parsers.push(function(value) {
          if(value === null) {
            return -1;
          } else if(!value) {
            return value;
          }

          return (value.getHours() * 60) + value.getMinutes();
        });
      }
    };
  }]);
