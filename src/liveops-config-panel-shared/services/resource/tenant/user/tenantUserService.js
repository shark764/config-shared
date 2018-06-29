'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUser', ['LiveopsResourceFactory', 'apiHostname', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, tenantUserInterceptor, tenantUserQueryInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

      var tenantUserStatusUpdateTransformer = function (obj) {
        var cpy = angular.copy(obj);

        if(obj.$original && obj.status === obj.$original.status) {
          delete cpy.status;
        }

        return cpy;
      };

      var TenantUser = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }, {
          name: 'extensions',
          optional: true
        }, {
          name: 'activeExtension',
          optional: true
        }, {
          name: 'supervisorId',
          optional: true
        }, {
          name: 'defaultIdentityProvider'
        }, {
          name: 'invitationStatus'
        }, {
          name: 'noPassword'
        }, {
          name: 'workStationId'
        }],
        putRequestTransformer: tenantUserStatusUpdateTransformer,
        postRequestTransformer: tenantUserStatusUpdateTransformer,
        getInterceptor: [tenantUserInterceptor, emitErrorInterceptor],
        queryInterceptor: [tenantUserQueryInterceptor, emitErrorInterceptor],
        saveInterceptor: [tenantUserInterceptor, cacheAddInterceptor],
        updateInterceptor: tenantUserInterceptor
      });

      TenantUser.prototype.getDisplay = function () {
        if (this.$user) { //TODO: update unit tests and mocks to all have $user
          return this.$user.getDisplay();
        }
      };

      var reset = TenantUser.prototype.reset;

      TenantUser.prototype.reset = function () {
        reset.call(this);

        this.$user.reset();
      };

      TenantUser.prototype.isNew = function() {
        return !this.id;
      };

      TenantUser.prototype.removePropsBeforeSave = function (tenantUserObj) {
        // force an empty workStationId string to be null
        if (
          !tenantUserObj.workStationId ||
          tenantUserObj.workStationId === ''
        ) {
          tenantUserObj.workStationId = null;
        }

        return _.omit(tenantUserObj, [
          'activeExtension',
          'disableCxEngageStatusSelect',
          'disableDefaultSsoProvider',
          'hasPassword',
          'identityProviders',
          'resourceName',
          'displayStatus',
          'tenantCxLoginStatus',
          'invitationStatus'
        ]);
      };

      return TenantUser;
    }
  ]);
