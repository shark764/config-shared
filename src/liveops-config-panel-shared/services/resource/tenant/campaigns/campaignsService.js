'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Campaign', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var Campaign = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:id',
        resourceName: 'Campaign',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'flowId'
        }, {
          name: 'defaultTimeZone',
        }, {
          name:'doNotCallLists'
        }, {
          name: 'callerID',
          optional:true
        }, {
          name: 'defaultLeadExpiration',
          optional:true
        }, {
          name: 'defaultLeadRetryInterval',
          optional:true
        }, {
          name: 'defaultMaxRetries',
          optional: true
        }, {
          name: 'dispositionCodeListId'
        }, {
          name: 'dispositionMappings'
        }, {
          name: 'schedule'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Campaign.prototype.getDisplay = function () {
        return this.name;
      };

      return Campaign;
    }
  ]);
