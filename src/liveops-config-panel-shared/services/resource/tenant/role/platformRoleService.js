'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('PlatformRole', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      var PlatformRole = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/roles:id',
        resourceName: 'PlatformRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

      PlatformRole.prototype.getDisplay = function() {
        return this.name;
      };

      PlatformRole.getName = function(roleId) {
        return PlatformRole.cachedGet({
          id: roleId
        }).name;
      };

      return PlatformRole;
    }
  ]);
