'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Campaign', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {
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
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Campaign.prototype.getDisplay = function () {
        return this.name;
      };

      return Campaign;
    }
  ]);
