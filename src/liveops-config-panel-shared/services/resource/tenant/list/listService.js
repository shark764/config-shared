'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('List', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor', 'itemBackupInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor, itemBackupInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/lists/:id',
        resourceName: 'List',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'items'
        }],
        getInterceptor: itemBackupInterceptor,
        queryInterceptor: itemBackupInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor, itemBackupInterceptor],
        updateInterceptor: [emitInterceptor, itemBackupInterceptor]
      });

      List.prototype.getDisplay = function () {
        return this.name;
      };
      
      return List;
    }
  ]);