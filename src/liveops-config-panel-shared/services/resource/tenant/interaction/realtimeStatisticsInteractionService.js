'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('RealtimeStatisticInteraction', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var RealtimeStatisticInteraction = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/realtime-statistics/interactions',
        resourceName: 'RealtimeStatisticInteraction'
      });

      return RealtimeStatisticInteraction;
    }
  ]);