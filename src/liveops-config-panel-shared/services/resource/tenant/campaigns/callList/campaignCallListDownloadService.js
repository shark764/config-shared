'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignCallListDownload', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'Session',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, Session) {
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
      CampaignCallListDownload.prototype.download = function(campaignId){
        //console.log("FIRED FUNCTION");
        document.location.href = 'https://' + window.atob(Session.token) + apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + campaignId + '/call-list/download.csv';
      }
      return CampaignCallListDownload;
    }
  ]);
