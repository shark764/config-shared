'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserMessageTemplate', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/message-templates/:messageTemplateId',
        resourceName: 'TenantUserMessageTemplate',
        requestUrlFields: {
          messageTemplateId: '@messageTemplateId',
          tenantId: '@tenantId',
          userId: '@userId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });
    }
  ]);
