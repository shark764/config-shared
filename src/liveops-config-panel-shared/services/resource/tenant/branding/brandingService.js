'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Branding', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'stylesTransformer', 'saveStylesTransformer',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, stylesTransformer, saveStylesTransformer) {

      var Branding = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/branding',
        resourceName: 'Branding',
        updateFields: [{
          name: 'logo',
          optional: true
        }, {
          name: 'favicon',
          optional: true
        }, {
          name: 'styles',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor,
        getResponseTransformer: stylesTransformer,
        putResponseTransformer: stylesTransformer,
        putRequestTransformer: saveStylesTransformer
      });

      Branding.prototype.delete = function(params) {
        var promise = Branding.prototype.$delete(params);

        promise.then(function(result) {
          return result;
        });

        return promise;
      };

      return Branding;
    }
  ]);
