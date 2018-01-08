'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Tenant', ['LiveopsResourceFactory', 'Session', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, Session, apiHostname, emitInterceptor, emitErrorInterceptor, queryCache, cacheAddInterceptor) {

      var Tenant = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:id',
        resourceName: 'Tenant',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'active'
        }, {
          name: 'adminUserId'
        }, {
          name: 'timezone'
        }, {
          name: 'outboundIntegrationId',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Tenant.prototype.getDisplay = function () {
        return this.name;
      };

      //This is an awkward workaround for tenant list functionality
      //in the case where list should only show current selected tenant due to having MANAGE_TENANT permission
      var obj = Tenant;
      Tenant.prototype.getAsArray = function(id){
        var cached = queryCache.get(id + 'arr');

        if (!cached) {
          var item = obj.get({id: id});
          var mockArray = [item];
          mockArray.$promise = item.$promise;
          mockArray.$resolved = true;
          queryCache.put(id + 'arr', mockArray);
          return mockArray;
        }

        return cached;
      };

      Tenant.prototype.updateSessionTenantProps = function (updatedTenantData, updatedTenantDataPropToCopy, targetPropToUpdate) {
        var currentSessionTenantIdx = _.findIndex(Session.tenants, function (sessionTenant) {
          return updatedTenantData.id === sessionTenant.tenantId;
        });

        // if we're not dealing with one of the tenants in the session then
        // there's nothing more for us to do here
        if (currentSessionTenantIdx === -1) {
          return;
        }

        // in the event that we're changing the "tenantActive" flag/property, and the
        // current tenant was set to inactive, then reset the dropdown
        // to the first tenant in the list
        var currentSessionTenantId = Session.tenant.tenantId;
        var tenantBeingUpdatedId = updatedTenantData.id;
        var hasTenantActiveProperty = _.has(Session.tenants[currentSessionTenantIdx], 'tenantActive');

        // if the tenant that just got modified is the active tenant
        if (
          (currentSessionTenantId === tenantBeingUpdatedId) &&
          hasTenantActiveProperty
        ) {
          // if the tenant being modified is not active
          if (Session.tenants[currentSessionTenantIdx].tenantActive === false) {
            Session.setTenant({
              tenantId: Session.tenants[0].tenantId,
              tenantName: Session.tenants[0].tenantName,
              tenantPermissions: Session.tenants[0].tenantPermissions
            });
          }
        }

        var tempTenantsData = Object.assign(Session.tenants);
        tempTenantsData[currentSessionTenantIdx][targetPropToUpdate] = updatedTenantData[updatedTenantDataPropToCopy];

        Session.setTenants(tempTenantsData);
      };

      return Tenant;
    }
  ]);
