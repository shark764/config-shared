'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .filter('trusted', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);