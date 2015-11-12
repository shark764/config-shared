'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DispatchMapping', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var DispatchMapping = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dispatch-mappings/:id',
        resourceName: 'DispatchMapping',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'value',
          optional: true
        }, {
          name: 'flowId',
          optional: true
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'interactionField',
          optional: true
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      DispatchMapping.prototype.getDisplay = function () {
        return this.name;
      };

      return DispatchMapping;
    }
  ]);