'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DncLists', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {
      var DncLists = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dnclists/:id',
        resourceName: 'DncLists',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'expiration',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      DncLists.prototype.getDisplay = function () {
        return this.name;
      };

      return DncLists;
    }
  ]);
