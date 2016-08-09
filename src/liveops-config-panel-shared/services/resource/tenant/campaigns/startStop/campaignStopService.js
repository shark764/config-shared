'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignStop', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignStop = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/stop',
        resourceName: 'CampaignStop',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignStop;
    }
  ]);
