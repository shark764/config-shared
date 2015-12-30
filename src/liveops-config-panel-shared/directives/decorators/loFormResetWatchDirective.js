'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormResetWatch', [
    function () {
      return {
        restrict: 'A',
        require: ['ngModel', 'form'],
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, ctrls) {
          var formController = ctrls[1];
          var controller = elem.data('$loFormResetWatchController');
          controller.formController =formController;
          formController.resetController = controller;

          scope.$watch(attrs.ngModel, function(newResource, oldResource) {
            if(oldResource) {
              controller.reset(oldResource);
            }
          });
        }
      };
    }
  ]);
