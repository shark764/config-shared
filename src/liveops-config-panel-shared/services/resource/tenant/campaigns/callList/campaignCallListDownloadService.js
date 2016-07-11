'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignCallListDownload', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignCallListDownload = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/call-list/download',
        requestUrlFields: {
          tenantId: '@tenantId',
          campaignId: '@campaignId'
        },
        resourceName: 'CampaignCallListDownload',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignCallListDownload;
    }
  ]);
