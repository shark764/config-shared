'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignStart', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignStart = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/:versionId/start',
        requestUrlFields: {
          tenantId: '@tenantId',
          campaignId: '@campaignId',
          versionId: '@versionId'
        },
        resourceName: 'CampaignStart',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignStart;
    }
  ]);
