'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('List', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/lists/:id',
        resourceName: 'List',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, , {
          name: 'items'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      List.prototype.getDisplay = function () {
        return this.name;
      };
      
      return List;
    }
  ]);