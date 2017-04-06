'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('fileUpload', ['$window', '$http', 'apiHostname', 'Session', function ($window, $http, apiHostname, Session) {
    this.uploadImg = function(file, type){
      var uploadUrl = apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/branding/' + type + '/upload';
      var fd = new $window.FormData();
      fd.append('file', file);
      return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
    };
  }]);
