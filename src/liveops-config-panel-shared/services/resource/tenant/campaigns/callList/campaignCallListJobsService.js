'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignCallListJobs', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignCallListJobs = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/call-list/jobs/:jobId',
        requestUrlFields: {
          tenantId: '@tenantId',
          campaignId: '@campaignId',
          jobId: '@jobId'
        },
        resourceName: 'CampaignCallListJobs',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignCallListJobs;
    }
  ]);
