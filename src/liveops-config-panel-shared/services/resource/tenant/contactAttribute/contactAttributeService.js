'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ContactAttribute', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    function removeNameAndType(req) {
      delete req.objectName;
      delete req.type;
      return req;
    }

    var ContactAttribute = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/contacts/attributes/:id',
      resourceName: 'ContactAttribute',
      updateFields: [
        {
          name: 'label',
          required: true
        },
        {
          name: 'objectName'
        },
        {
          name: 'mandatory'
        },
        {
          name: 'default'
        },
        {
          name: 'type'
        },
        {
          name: 'active'
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor,
      putRequestTransformer: removeNameAndType
    });

    ContactAttribute.prototype.getDisplay = function() {
      return this.objectName;
    };

    return ContactAttribute;

  }]);
