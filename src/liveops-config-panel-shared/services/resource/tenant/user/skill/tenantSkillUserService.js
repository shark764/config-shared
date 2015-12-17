'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantSkillUser', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);