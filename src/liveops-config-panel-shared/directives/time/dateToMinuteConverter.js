'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('dateToMinuteConverterController', [function() {
    this.format = function (value) {
      if(value === -1) {
        return null;
      } else if(angular.isNumber(value)) {
        return new Date(0,0,0,0,value,0,0);
      }

      return value;
    };
    
    this.parse = function(value) {
      if(value === null) {
        return -1;
      } else if(!(value instanceof Date)) {
        return value;
      }

      return (value.getHours() * 60) + value.getMinutes();
    };
  }])
  .directive('dateToMinuteConverter', [function () {
    return {
      require: 'ngModel',
      controller: 'dateToMinuteConverterController',
      link: function ($scope, elem, attr, ngModel) {
        var controller = elem.data('$dateToMinuteConverterController');
        ngModel.$formatters.push(controller.format);
        ngModel.$parsers.push(controller.parse);
      }
    };
  }]);
