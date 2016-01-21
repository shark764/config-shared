'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Alert', ['toastr', '$window', function (toastr, $window) {
    /** alert service
     * Display popup notices on the screen
     */
    this.confirm = function(message, onOk, onCancel){
      if ($window.confirm(message)){
        if (onOk){
          onOk();
        }
      } else {
        if (onCancel){
          onCancel();
        }
      }
    };

    this.warning = function(){
      toastr.warning.apply(this, arguments);
    };

    this.success = function(){
      toastr.success.apply(this, arguments);
    };

    this.error = function(){
      toastr.error.apply(this, arguments);
    };

    this.info = function(){
      toastr.info.apply(this, arguments);
    };
  }]);