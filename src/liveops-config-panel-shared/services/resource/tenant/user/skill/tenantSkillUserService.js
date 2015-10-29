'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantSkillUser', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser'
      });

    }
  ]);