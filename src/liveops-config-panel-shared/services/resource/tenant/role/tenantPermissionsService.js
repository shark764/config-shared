'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantPermission', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      var TenantPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/permissions/:id',
        resourceName: 'TenantPermission',
        updateFields: [],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

      TenantPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return TenantPermission;
    }
  ]);
