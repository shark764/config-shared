'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ContactLayout', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var ContactLayout = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/contacts/layouts/:id',
      resourceName: 'ContactLayout',
      updateFields: [
        {
          name: 'name'
        },
        {
          name: 'description'
        },
        {
          name: 'layout'
        },
        {
          name: 'active'
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor
    });

    ContactLayout.prototype.getDisplay = function() {
      return this.name;
    };

    return ContactLayout;

  }]);
