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
          name: 'active',
        }, {
          name: 'activeVersion',
          optional: true
        },{
          name: 'without-active-dashboard'}],
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