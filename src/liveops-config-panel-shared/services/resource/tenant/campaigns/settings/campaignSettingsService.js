'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CampaignSettings', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var CampaignSettings = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:id',
        resourceName: 'CampaignSettings',
        updateFields: [{
          name: 'name'
        }, {
          name: 'channel'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'dialer'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      return CampaignSettings;
    }
  ]);
