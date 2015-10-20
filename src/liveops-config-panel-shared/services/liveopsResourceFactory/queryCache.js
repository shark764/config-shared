'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('queryCache', ['$cacheFactory',
    function($cacheFactory) {
      return $cacheFactory('queryCache');
    }]);