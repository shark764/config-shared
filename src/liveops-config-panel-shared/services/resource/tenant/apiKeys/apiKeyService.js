'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ApiKey', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var ApiKey = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/api-keys/:id',
        resourceName: 'ApiKey',
        updateFields: [{
          name: 'name'
        }, {
          name: 'roleId'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'additionalRoleIds',
          optional: true
        }, {
          name: 'status',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      ApiKey.prototype.getDisplay = function () {
        return this.name;
      };

      return ApiKey;
    }
  ]);
