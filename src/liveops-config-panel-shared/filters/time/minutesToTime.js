'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('minutesToTime', ['$moment', function ($moment) {
      return function (minutes) {
        if(!angular.isNumber(minutes) || minutes < 0) {
          return null;
        }
        
        var newDate = $moment();
        newDate.hours(0);
        newDate.minutes(minutes);

        return newDate.format('HH:mm');
      };
    }
]);
