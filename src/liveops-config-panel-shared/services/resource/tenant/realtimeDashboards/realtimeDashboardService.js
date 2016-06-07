'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('RealtimeDashboard', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

      var RealtimeDashboard = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dashboards/:id',
        resourceName: 'RealtimeDashboard',
        updateFields: [{
          name: 'name'
        }, {
          name: 'enabled',
        }, {
          name: 'activeVersion',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      RealtimeDashboard.prototype.getDisplay = function () {
        return this.name;
      };

      return RealtimeDashboard;
    }
  ]);