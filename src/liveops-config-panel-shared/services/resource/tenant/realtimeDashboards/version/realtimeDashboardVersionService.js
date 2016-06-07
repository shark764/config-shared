'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('RealtimeDashboardVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

      var RealtimeDashboardVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dashboards/:dashboardId/versions/:version',
        resourceName: 'RealtimeDashboardVersion',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'dashboardId'
        }, {
          name: 'widgets'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      RealtimeDashboardVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return RealtimeDashboardVersion;
    }
  ]);