'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Reason', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var Reason = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/reasons/:id',
      resourceName: 'Reason',
      updateFields: [{
        name: 'name'
      }, {
        name: 'description',
        optional: true
      }, {
        name: 'externalId',
        optional: true
      }, {
        name: 'active'
      }, {
        name: 'shared'
      }],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    Reason.prototype.getDisplay = function() {
      return this.name;
    };

    return Reason;

  }]);
