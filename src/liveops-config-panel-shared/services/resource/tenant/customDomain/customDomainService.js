'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomDomain', ['$rootScope', '$state', 'Session', 'LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function ($rootScope, $state, Session, LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

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
        var domain = Session.domain;
        var helpURL = "http://docs.cxengage.net";
        if (domain && domain !== '') {
          helpURL = 'http://'+domain.value+'-docs.cxengage.net';
        }
        return helpURL + helpURLSuffix;
      };

      return CustomDomain;
    }
  ]);
