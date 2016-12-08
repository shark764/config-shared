'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantMessageTemplateUser', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/message-templates',
        resourceName: 'TenantUserMessageTemplate',
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
