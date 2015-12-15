'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('moment', ['$moment', function ($moment) {
    return function (dateString, format) {
      return $moment(dateString).format(format);
    };
  }]);