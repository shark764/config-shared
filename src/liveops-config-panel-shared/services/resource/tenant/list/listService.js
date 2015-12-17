'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('List', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'queryCache', 'cacheAddInterceptor', 'itemBackupInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, queryCache, cacheAddInterceptor, itemBackupInterceptor) {

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
        }, {
          name: 'active'
        }],
        getInterceptor: [itemBackupInterceptor, emitErrorInterceptor],
        queryInterceptor: [itemBackupInterceptor, emitErrorInterceptor],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor, itemBackupInterceptor],
        updateInterceptor: [emitInterceptor, itemBackupInterceptor]
      });

      List.prototype.getDisplay = function () {
        return this.name;
      };
      
      return List;
    }
  ]);