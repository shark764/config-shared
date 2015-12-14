'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('modelResetService', ['toastr', '$window', function (toastr, $window) {
    this.reset = function reset(model) {
      if(!model.$original) {
        throw new Error('Model does not support reset');
        return;
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