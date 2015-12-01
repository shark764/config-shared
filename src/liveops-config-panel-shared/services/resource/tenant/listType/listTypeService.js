'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ListType', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/list-types/:id',
        resourceName: 'List',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
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