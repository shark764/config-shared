'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantReasonListUser', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/reason-lists',
        resourceName: 'TenantUserReasonList',
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
