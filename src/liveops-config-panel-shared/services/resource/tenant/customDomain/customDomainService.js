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

      CustomDomain.setHelpURL = function(tenantId) {
        var customDomain = CustomDomain.cachedGet({
          tenantId: tenantId
        });

        customDomain.$promise.then(function (response) {
            if (response !== undefined && response.active === true && response.value !== '') {
              $rootScope.helpURL = 'http://'+response.value+'-docs.cxengage.net';
            } else {
              $rootScope.helpURL = 'http://docs.cxengage.net';
            }
            $rootScope.$broadcast('updateHelpURL');
          }, function (error) {
            $rootScope.helpURL = 'http://docs.cxengage.net';
            $rootScope.$broadcast('updateHelpURL');
            if (error.status !== 404) {
              console.log("No Custom Domain Error:", error);
            }
          });
      };


      return CustomDomain;
    }
  ]);
