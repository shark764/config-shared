'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Disposition', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var Disposition = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/dispositions/:id',
      resourceName: 'Disposition',
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

    Disposition.prototype.getDisplay = function() {
      return this.name;
    };

    return Disposition;

  }]);
