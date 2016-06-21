'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DispositionList', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var DispositionList = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/disposition-lists/:id',
      resourceName: 'DispositionList',
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
          name: 'dispositions',
          optional: true
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    DispositionList.prototype.getDisplay = function() {
      return this.name;
    };

    return DispositionList;

  }]);
