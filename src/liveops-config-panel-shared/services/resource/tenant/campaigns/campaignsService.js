'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Campaign', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var Campaign = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:id',
        resourceName: 'Campaign',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'currentState'
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Campaign.prototype.getDisplay = function () {
        return this.name;
      };

      return Campaign;
    }
  ]);
