'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Supervisors', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor) {

    var Supervisors = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/users/supervisor-users',
      resourceName: 'Supervisor',
      updateFields: null,
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    Supervisors.prototype.getDisplay = function () {
      return this.firstName + ' ' + this.lastName;
    };

    return Supervisors;

  }]);
