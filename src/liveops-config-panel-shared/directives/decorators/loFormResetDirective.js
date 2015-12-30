'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormReset', [
    function () {
      return {
        restrict: 'A',
        require: 'form',
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, formController) {
          var controller = elem.data('$loFormResetController');
          controller.formController = formController;
          formController.loFormResetController = controller;
        }
      };
    }
  ]);
