'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DncLists', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {
      var DncLists = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dnclists/:id',
        resourceName: 'DncLists',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'expiration',
          optional: true
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      DncLists.prototype.getDisplay = function () {
        return this.name;
      };

      DncLists.prototype.download = function (dncListId, session) {
        var apiHostNameNoProtocol = apiHostname.slice(8);
        window.location.href = 'https://' + window.atob(session.token) + '@' + apiHostNameNoProtocol + '/v1/tenants/' + session.tenant.tenantId + '/dnclists/' + dncListId + '/download.csv';
      }

      return DncLists;
    }
  ]);
