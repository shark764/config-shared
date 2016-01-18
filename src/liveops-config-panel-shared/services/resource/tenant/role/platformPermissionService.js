'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('PlatformPermission', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      var PlatformPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/permissions/:id',
        resourceName: 'PlatformPermission',
        updateFields: [],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

      PlatformPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return PlatformPermission;
    }
  ]);
