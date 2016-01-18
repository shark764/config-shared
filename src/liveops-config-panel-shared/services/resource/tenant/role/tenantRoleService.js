'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantRole', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, Session, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var TenantRole = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/roles/:id',
        resourceName: 'TenantRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitErrorInterceptor
      });

      TenantRole.prototype.getDisplay = function() {
        return this.name;
      };

      TenantRole.getName = function(roleId) {
        return TenantRole.cachedGet({
          tenantId: Session.tenant.tenantId,
          id: roleId
        }).name;
      };

      return TenantRole;
    }
  ]);
