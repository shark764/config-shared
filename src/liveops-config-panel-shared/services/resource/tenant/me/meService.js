'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Me', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
      var Me = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/me',
        resourceName: 'Me',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor,
      });

      // same as the usual Me.cachedQuery() call, except that this one only returns
      // active tenants assigned to the user (less code in controller this way)
      Me.prototype.getActiveTenants = function () {
        var meData = Me.cachedQuery();
        return meData.$promise.then(function (tenantsResponse) {
          return _.filter(tenantsResponse, function (val) {
            return val.active;
          });
        });
      };

      return Me;
    }
  ]);
