'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignVersionLatest', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignVersionLatest = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/latest',
        resourceName: 'CampaignVersionLatest',
        updateFields: [{
          name: 'campaignId'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      CampaignVersionLatest.prototype.getLatestCampaignVersions = function () {

      };

      return CampaignVersionLatest;
    }
  ]);
