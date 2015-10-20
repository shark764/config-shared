'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('keysCount', [function () {
    return function (obj) {
      return Object.keys(obj).length;
    };
  }]);