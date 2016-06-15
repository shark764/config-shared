'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomStatVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

      var CustomStatVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/custom-stats/:customStatId/versions/:version',
        resourceName: 'CustomStatVersion',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'customStatId'
        }, {
          name: 'customStat'
        }, {
          name: 'metadata'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      CustomStatVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return CustomStatVersion;
    }
  ]);
