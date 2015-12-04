'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('itemBackupInterceptor', [function () {
    this.response = function (response) {
      var lists = response.resource;

      if (!angular.isArray(lists)) {
        lists = [lists];
      }

      angular.forEach(lists, function (list) {
        angular.forEach(list.items, function (item) {
          item.$original = angular.copy(item);
        });
      });

      return response.resource;
    };
  }]);