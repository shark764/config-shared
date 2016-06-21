'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ReasonList', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var ReasonList = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/reason-lists/:id',
      resourceName: 'ReasonList',
      updateFields: [
        {
          name: 'name'
        },
        {
          name: 'description',
          optional: true
        },
        {
          name: 'externalId',
          optional: true
        },
        {
          name: 'active'
        },
        {
          name: 'shared'
        },
        {
          name: 'reasons',
          optional: true
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    ReasonList.prototype.getDisplay = function() {
      return this.name;
    };

    return ReasonList;

  }]);
