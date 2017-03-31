'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('stylesTransformer', [
    function () {
      return function (value) {
        if (typeof value === 'string') {
          value = JSON.parse(value);
          if (value.result) {
            value = value.result;
          }
        }
        if (typeof value.styles === 'string') {
          value.styles = JSON.parse(value.styles);
        }
        return value;
      };
    }
  ]);
