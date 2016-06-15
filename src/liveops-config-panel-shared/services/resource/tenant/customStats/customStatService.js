'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomStat', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

      var CustomStat = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/custom-stats/:id',
        resourceName: 'CustomStat',
        updateFields: [{
          name: 'name'
        }, {
          name: 'custom-stat',
        }, {
          name: 'description',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      CustomStat.prototype.getDisplay = function () {
        return this.name;
      };

      return CustomStat;
    }
  ]);