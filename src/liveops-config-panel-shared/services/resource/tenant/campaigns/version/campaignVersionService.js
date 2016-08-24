'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignVersion', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/:versionId',
        resourceName: 'CampaignVersion',
        requestUrlFields: {
          campaignId: '@campaignId'
        },
        updateFields: [{
          name: 'flowId'
        }, {
          name: 'defaultTimeZone'
        }, {
          name: 'defaultRegion',
          optional: true
        }, {
          name: 'channel'
        }, {
          name: 'doNotContactLists'
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

      CampaignVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return CampaignVersion;
    }
  ]);
