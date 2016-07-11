'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserCapacityRules', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/capacity-rules/:capacityRuleId',
        resourceName: 'TenantUserCapacityRules',
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId',
          capacityRuleId: '@id'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
