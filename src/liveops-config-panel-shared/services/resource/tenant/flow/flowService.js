'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Flow', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {
      var self = this;

      var Flow = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:id',
        resourceName: 'Flow',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion',
          optional: true
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'type'
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Flow.prototype.getDisplay = function () {
        return this.name;
      };

      Flow.prototype.cloneFlow = function (flowData, sourceData) {
        var allFlowData = {
          selectedFlowData: flowData
        };

        if (sourceData) {
          allFlowData.selectedFlowDataToCopy = sourceData.flow;
        }

        self.scopeObj.$emit('flowSvc:cloneFlow', allFlowData);
      };

      Flow.prototype.getScope = function (scope) {
        self.scopeObj = scope;
      };

      return Flow;
    }
  ]);
