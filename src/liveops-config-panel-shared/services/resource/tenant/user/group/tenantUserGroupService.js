'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:memberId/groups',
        resourceName: 'TenantUserGroup',
        requestUrlFields: {
          tenantId: '@tenantId',
          memberId: '@memberId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);