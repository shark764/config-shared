'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TransferList', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var TransferList = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/transfer-lists/:id',
      resourceName: 'TransferList',
      updateFields: [
        {
          name: 'name'
        },
        {
          name: 'description',
          optional: true
        },
        {
          name: 'endpoints'
        },
        {
          name: 'active'
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    TransferList.prototype.getDisplay = function() {
      return this.name;
    };

    return TransferList;

  }]);
