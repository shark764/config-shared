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
        updateInterceptor: [emitInterceptor],
      });

      Me.prototype.getIdps = function(tenantList, tenantId) {
        if (!tenantList || tenantList.length === 0) {
          return false;
        }

        var identityProvidersList = _.find(tenantList, function (tenant) {
          return tenant.tenantId === tenantId;
        }).identityProviders;

        return _.map(identityProvidersList, function (idpObj) {
          return _.pick(idpObj, ['id', 'name']);
        });
      };

      return Me;
  }]);
