'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var Integration = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/integrations/:id',
        resourceName: 'Integration',
        updateFields: [{
          name: 'description'
        }, {
          name: 'properties'
        }, {
          name: 'accountSid'
        }, {
          name: 'authToken'
        }, {
          name: 'webRtc'
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Integration.prototype.getDisplay = function () {
        return this.type;
      };

      return Integration;
    }
  ]);
