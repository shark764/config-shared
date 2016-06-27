'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

      var CampaignVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/versions/:version',
        resourceName: 'CampaignVersion',
        updateFields: [{
          name: 'version'
        }, {
          name: 'created'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      CampaignVersion.prototype.getDisplay = function () {
        return this.version;
      };

      return CampaignVersion;
    }
  ]);
