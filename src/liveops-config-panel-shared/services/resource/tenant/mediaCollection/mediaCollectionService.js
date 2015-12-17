'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('MediaCollection', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'mediaCollectionMapCleanTransformer',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, mediaCollectionMapCleanTransformer) {

      var MediaCollection = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media-collections/:id',
        resourceName: 'MediaCollection',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'mediaMap',
          optional: true
        }, {
          name: 'defaultMediaKey',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        putRequestTransformer: mediaCollectionMapCleanTransformer
      });

      return MediaCollection;
    }
  ]);
