'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('tenantUserTransformer', ['User', 'TenantRole', 'Session', function(User, TenantRole, Session) {
    var rename = function(tenantUser, fieldName, newFieldName) {
      tenantUser[newFieldName] = tenantUser[fieldName];
      delete tenantUser[fieldName];
    };

    var moveToUser = function(tenantUser, source, destination) {
      tenantUser.$user[destination ? destination : source] = tenantUser[source];
      delete tenantUser[source];
    };

    var copyToUser = function(tenantUser, member) {
      tenantUser.$user[member] = tenantUser[member];
    };

    this.transform = function(tenantUser) {

      tenantUser.$user = new User();
      _.remove(tenantUser.extensions, {
        provider: 'plivo'
      });

      if(tenantUser.userId) {
        rename(tenantUser, 'userId', 'id');
      }

      moveToUser(tenantUser, 'firstName');
      moveToUser(tenantUser, 'lastName');
      moveToUser(tenantUser, 'externalId');
      moveToUser(tenantUser, 'defaultTenant');
      moveToUser(tenantUser, 'personalTelephone');

      copyToUser(tenantUser, 'id');
      copyToUser(tenantUser, 'email');

      rename(tenantUser, 'groups', '$groups');
      rename(tenantUser, 'skills', '$skills');
      rename(tenantUser, 'capacityRules', '$capacityRules');

      if (tenantUser.roleName) {
        rename(tenantUser, 'roleName', '$roleName');
      } else if (Session.tenant && Session.tenant.tenantId){
        tenantUser.$roleName = TenantRole.getName(tenantUser.roleId);
      }

      if (tenantUser.activeExtension &&
        !Object.keys(tenantUser.activeExtension).length) {
        delete tenantUser.activeExtension;
      }

      if (Session.tenant){
        //Required so that we can get a cache hit on TenantUser.cachedGet
        tenantUser.tenantId = Session.tenant.tenantId;
      }

      tenantUser.$user.$original = angular.copy(tenantUser.$user);
    };
  }])
  .service('tenantUserInterceptor', ['tenantUserTransformer',
    function(TenantUserTransformer) {
      this.response = function(response) {
        var tenantUser = response.resource;

        TenantUserTransformer.transform(tenantUser);

        return tenantUser;
      };
    }
  ])
  .service('tenantUserQueryInterceptor', ['tenantUserTransformer',
    function(TenantUserTransformer) {
      this.response = function(response) {
        angular.forEach(response.resource, function(tenantUser) {
          TenantUserTransformer.transform(tenantUser);
        });

        return response.resource;
      };
    }
  ]);
