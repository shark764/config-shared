'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CapacityRuleVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var CapacityRuleVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/capacity-rules/:capacityRuleId/versions/:version',
        resourceName: 'CapacityRuleVersion',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'ruleSet',
        }, {
          name: 'capacityRuleId'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      CapacityRuleVersion.prototype.getDisplay = function () {
        return this.name;
      };

      CapacityRuleVersion.prototype.cacheKey = function () {
        return 'CapacityRule' + this.capacityRuleId;
      };

      return CapacityRuleVersion;
    }
  ]);
