'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DncListJobs', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var DncListJobs = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dnclists/:dncListId/jobs/:jobId',
        requestUrlFields: {
          tenantId: '@tenantId',
          dncListId: '@dncListId',
          jobId: '@jobId'
        },
        resourceName: 'DncListJobs',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return DncListJobs;
    }
  ]);
