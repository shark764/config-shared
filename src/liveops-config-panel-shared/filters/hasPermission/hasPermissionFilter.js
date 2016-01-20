'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('hasPermission', ['UserPermissions', function (UserPermissions) {
    /** hasPermission filter
     * Accepts an array of strings that are permission names, or a single string that is a permission name
     * Returns true if the currently authenticated user has at least one of the given permissions
     * Returns false if the currently authenticated user does not have any of the given permissions
     */
    return function (permissions) {
      if (! angular.isArray(permissions)){
        permissions = [permissions];
      }

      return UserPermissions.hasPermissionInList(permissions);
    };
  }]);