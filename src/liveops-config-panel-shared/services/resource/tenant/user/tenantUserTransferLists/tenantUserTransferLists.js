'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserTransferList', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/transfer-lists/:transferListId',
        resourceName: 'TenantUserTransferList',
        requestUrlFields: {
          transferListId: '@transferListId',
          tenantId: '@tenantId',
          userId: '@userId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });
    }
  ]);
