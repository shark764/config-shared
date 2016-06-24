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
          name: 'name'
        }, {
          name: 'createdOn',
        }, {
          name: 'createBy'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      CampaignVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return CampaignVersion;
    }
  ]);
