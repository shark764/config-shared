'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('FlowVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

      var FlowVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:flowId/versions/:version',
        resourceName: 'FlowVersion',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'flowId'
        }, {
          name: 'flow'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      FlowVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return FlowVersion;
    }
  ]);
