'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('keysCount', [function () {
    /** keysCount filter
     * Accepts an object
     * Returns the number of properties/keys in the object
     */
    return function (obj) {
      return Object.keys(obj).length;
    };
  }]);