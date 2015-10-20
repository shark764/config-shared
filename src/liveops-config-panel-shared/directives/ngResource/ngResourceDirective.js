'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('ngResource', [function () {
    return {
      restrict: 'A',
      controller: function() {
        //TODO: validate resource object
      }
    };
  }]);