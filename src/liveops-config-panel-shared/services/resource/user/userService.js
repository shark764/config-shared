'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('User', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'userUpdateTransformer',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, userUpdateTransformer) {
      var User = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/users/:id',
        resourceName: 'User',
        updateFields: [{
          name: 'firstName',
          optional: true
        }, {
          name: 'lastName',
          optional: true
        }, {
          name: 'password'
        }, {
          name: 'currentPassword'
        }, {
          name: 'externalId',
          optional: true
        }, {
          name: 'personalTelephone',
          optional: true
        }, {
          name: 'defaultTenant',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: [emitInterceptor, userUpdateTransformer],
        putRequestTransformer: userUpdateTransformer
      });

      User.prototype.getDisplay = function() {
        if (this.firstName || this.lastName) {
          var name = (this.firstName ? this.firstName : '') + ' ' + (this.lastName ? this.lastName : '');
          return name.trim();
        } else {
          return this.email;
        }
      };

      User.prototype.isResendAllowed = function () {
        var allowedStatusesForResend = [
          'pending',
          'invited',
          'expired'
        ];

        return allowedStatusesForResend.indexOf(status) !== -1;
      };

      return User;
    }
  ])
  .service('userUpdateTransformer', ['Session', function(Session) {
    return function(user) {
      if(!Session.isAuthenticated() || user.id === Session.user.id) {
        delete user.status; //User cannot edit their own status
        delete user.roleId; //User cannot edit their own platform roleId
      }
      return user;
    };
  }]);
