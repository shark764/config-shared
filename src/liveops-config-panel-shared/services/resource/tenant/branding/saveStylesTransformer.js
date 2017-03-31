'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('saveStylesTransformer', [
    function () {
      return function (value) {
        if (typeof value.styles === 'object') {
          value.styles = JSON.stringify(value.styles);
        }
        return value;
      };
    }
  ]);
