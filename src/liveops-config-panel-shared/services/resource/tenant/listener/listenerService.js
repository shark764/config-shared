'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Listener', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {
      var Listener = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/integrations/:integrationId/listeners/:id',
        resourceName: 'Listener',
        updateFields: [{
          name: 'name'
        }, {
          name: 'active'
        }, {
          name: 'properties',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Listener.prototype.getDisplay = function () {
        return this.name;
      };

      Listener.prototype.cacheKey = function () {
        return 'Listener' + this.integrationId;
      };

      return Listener;
    }
  ]);
