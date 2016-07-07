'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantGroupUsers', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/reason-lists',
        resourceName: 'TenantReasonListUser',
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
