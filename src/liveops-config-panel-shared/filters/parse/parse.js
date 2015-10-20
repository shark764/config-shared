'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('parse', ['$parse', function($parse) {
    return function(target, param) {
      return $parse(param)(target);
    };
  }]);
