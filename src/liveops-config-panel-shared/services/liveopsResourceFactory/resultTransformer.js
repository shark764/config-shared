'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('resultTransformer', [
    function() {
      return function (value) {
        if (value.result) {
          return value.result;
        }

        return value;
      };
    }]);