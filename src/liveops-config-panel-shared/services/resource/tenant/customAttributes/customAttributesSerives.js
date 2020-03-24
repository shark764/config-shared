'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomAttributes', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {

      var CustomAttributes = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/custom-attributes/:id',
        resourceName: 'customAttributes',
        updateFields: [{
          name: 'identifier'
        },
        {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'dataType',
          optional: true
        }, {
          name: 'initialValue',
          optional: true
        },
        {
          name: 'defaultValue',
          optional: true
        },
        {
          name: 'realtimeReporting',
          optional: true
        },
        {
          name: 'historicalReporting',
          optional: true
        },
        {
          name: 'active',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: [emitInterceptor]
      });

      CustomAttributes.prototype.getDisplay = function () {
        return this.name;
      };

      return CustomAttributes;
    }
  ]);