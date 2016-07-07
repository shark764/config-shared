'use strict';

angular.module('liveopsConfigPanel.shared.services')
.factory('CampaignVersionLatest', ['LiveopsResourceFactory', '$q', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, $q, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var latestVersionId;

      var CampaignVersionLatest = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/latest',
        resourceName: 'CampaignVersionLatest',
        requestUrlFields: {
          tenantId: '@tenantId',
          campaignId: '@campaignId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        getResponseTransformer: function (response) {
          var responseObj = {};
          responseObj.versionId = JSON.parse(response);
          return responseObj;
        }
      });

      CampaignVersionLatest.prototype.getLatestVersionId = function (latestVersionId) {
        $q.when(latestVersionId.$promise).then(function (response) {
          console.log('response.versionId.result', response.versionId.result);
          return response.versionId.result;
        })

      }

      return CampaignVersionLatest;
    }
  ]);
