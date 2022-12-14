'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Skill', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var Skill = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:id',
        resourceName: 'Skill',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'hasProficiency'
        }, {
          name: 'active',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Skill.prototype.getDisplay = function () {
        return this.name;
      };

      return Skill;
    }
  ]);