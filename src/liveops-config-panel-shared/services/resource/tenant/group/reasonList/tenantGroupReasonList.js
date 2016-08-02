'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantGroupReasonList', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:groupId/reason-lists/:reasonListId',
        resourceName: 'TenantGroupReasonList',
        requestUrlFields: {
          reasonListId: '@reasonListId',
          tenantId: '@tenantId',
          groupId: '@groupId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
