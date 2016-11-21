'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('MessageTemplate', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    var MessageTemplate = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/message-templates/:id',
      resourceName: 'MessageTemplate',
      updateFields: [
        {
          name: 'name'
        },
        {
          name: 'description',
          optional: true
        },
        {
          name: 'channels'
        },
        {
          name: 'type'
        },
        {
          name: 'template'
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

    MessageTemplate.prototype.getDisplay = function() {
      return this.name;
    };

    return MessageTemplate;

  }]);
