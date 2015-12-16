'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormResetWatch', [
    function () {
      return {
        restrict: 'A',
        require: ['loFormResetController', 'ngModel'],
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, ctrls) {
          var formResetController = ctrls[0];
          
          scope.$watch(attrs.ngModel, function(newResource, oldResource) {
            if(oldResource) {
              formResetController.reset(oldResource);
            }
          });
        }
      };
    }
  ]);
