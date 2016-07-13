'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CapacityRule', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var CapacityRule = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/capacity-rules/:id',
        resourceName: 'CapacityRule',
        updateFields: [{
          name: 'name'
        },{
          name: 'activeVersion',
          optional: true
        },{
          name: 'active',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      CapacityRule.prototype.getDisplay = function () {
        return this.name;
      };

      CapacityRule.prototype.cacheKey = function () {
        return 'CapacityRule' + this.tenantId;
      };

      return CapacityRule;
    }
  ]);
