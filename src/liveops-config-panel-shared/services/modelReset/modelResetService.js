'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('modelResetService', [function () {
    this.reset = function reset(model) {
      if(!model.$original) {
        throw new Error('Model does not support reset');
      } else if(model.$reset) {
        return model.$reset();
      }
      
      for (var prop in model.$original) {
        if (prop.match(/^\$.*/g) ||
          angular.isFunction(model.$original[prop])) {
          continue;
        }
        model[prop] = angular.copy(model.$original[prop]);
      }
    };
  }]);