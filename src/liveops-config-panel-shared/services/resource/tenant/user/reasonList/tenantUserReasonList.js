'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserReasonList', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/reason-lists/:reasonListId',
        resourceName: 'TenantUserReasonList',
        requestUrlFields: {
          reasonListId: '@reasonListId',
          tenantId: '@tenantId',
          userId: '@userId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
