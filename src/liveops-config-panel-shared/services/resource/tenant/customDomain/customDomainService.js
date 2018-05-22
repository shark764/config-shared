'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomDomain', ['$rootScope', '$state', 'LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function ($rootScope, $state, LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var CustomDomain = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/protected-brandings/customDomain',
        resourceName: 'CustomDomain',
        updateFields: null,
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      // Getting URL for documentation, it concatenate Prefix and Suffix
      // Recieves Suffix from services call
      CustomDomain.prototype.getHelpURL = function(helpURLSuffix) {
        return 'http://docs.cxengage.net' + helpURLSuffix;
      };

      return CustomDomain;
    }
  ]);
