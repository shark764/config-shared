'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Me', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'activeTenantsOnly',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, activeTenantsOnly) {
      var hasCxEngageIdp = false;

      var Me = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/me',
        resourceName: 'Me',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor,
        queryResponseTransformer: activeTenantsOnly
      });

      Me.prototype.setHasCxEngageIdp = function (hasCxEngageIdpVal) {
        hasCxEngageIdp = hasCxEngageIdpVal.password;
      };

      Me.prototype.getHasCxEngageIdp = function () {
        return hasCxEngageIdp;
      };

      return Me;
    }
  ])
  .service('activeTenantsOnly', [
    function () {
      return function (value) {
        var activeTenants = JSON.parse(value);
        var filteredTenants = _.reject(activeTenants.result, {
          active: false
        });

        return filteredTenants;
      };
    }
  ]);
