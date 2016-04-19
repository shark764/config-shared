'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('secondsToTime', function () {
      return function (input) {
        var hours, minutes, seconds;
        var formattedData = '';

        if (input >= 3600) {
          hours = ('0' + Math.floor((input / 60) / 60)).slice(-2);
          minutes = ('0' + Math.floor((input / 60) % 60)).slice(-2);
          seconds = ('0' + Math.floor((input % 60) % 60)).slice(-2);
          formattedData = hours + ':' + minutes + ':' + seconds;
        } else if (input >= 60) {
          minutes = ('0' + Math.floor(input / 60)).slice(-2);
          seconds = ('0' + Math.floor(input % 60)).slice(-2);
          formattedData = '00:' + minutes + ':' + seconds;
        } else {
          seconds = ('0' + Math.floor(input)).slice(-2);
          formattedData = '00:00:' + seconds;
        }

        return formattedData.trim();
      };
    }
);
