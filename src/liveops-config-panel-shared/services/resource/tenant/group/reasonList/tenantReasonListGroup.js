'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantReasonListGroup', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:groupId/reason-lists',
        resourceName: 'TenantReasonListGroup',
        requestUrlFields: {
          tenantId: '@tenantId',
          groupId: '@groupId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
