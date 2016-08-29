'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Media', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {

      var Media = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media/:id',
        resourceName: 'Media',
        updateFields: [{
          name: 'name'
        }, {
          name: 'source'
        }, {
          name: 'type'
        }, {
          name: 'properties',
          optional: true
        }, {
          name: 'description',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

       Media.prototype.getDisplay = function (){
       return this.name;
      };

      return Media;
    }
  ]);
