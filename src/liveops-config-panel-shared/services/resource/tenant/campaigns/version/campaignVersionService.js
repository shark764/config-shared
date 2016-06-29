'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignVersion', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/:versionId',
        resourceName: 'CampaignVersion',
        updateFields: [{
          name: 'flowId'
        }, {
          name: 'defaultTimeZone'
        }, {
          name: 'doNotCallLists'
        }, {
          name: 'callerID',
          optional: true
        }, {
          name: 'defaultLeadExpiration',
          optional: true
        }, {
          name: 'defaultLeadRetryInterval',
          optional: true
        }, {
          name: 'defaultMaxRetries',
          optional: true
        }, {
          name: 'dispositionCodeListId'
        }, {
          name: 'dispositionMappings'
        }, {
          name: 'schedule'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignVersion;
    }
  ]);
