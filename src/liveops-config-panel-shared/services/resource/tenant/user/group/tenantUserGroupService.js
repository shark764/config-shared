'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/reason-lists/:reasonListId',
        resourceName: 'TenantUserReasonList',
        requestUrlFields: {
          reasonListId: '@reasonListId',
          tenantId: '@tenantId',
          memberId: '@memberId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
