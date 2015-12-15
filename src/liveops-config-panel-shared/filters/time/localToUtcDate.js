'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('localToUtcDate', ['$moment', function ($moment) {
      return function (date) {
        if(!date) {
          return date;
        }
        
        return $moment.utc(date);
      };
    }
]);

