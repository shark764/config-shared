'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('emitInterceptor', ['$rootScope', '$q', '$location', 'apiHostname', 'emitErrorInterceptor',
    function ($rootScope, $q, $location, apiHostname, emitErrorInterceptor) {
      this.response = function (response) {
        var path = response.config.url.replace(apiHostname + '/v1', '');
        var eventPath = path.replace(/\//g, ':');
        
        var proto = Object.getPrototypeOf(response.resource);
        
        if(response.status === 201){
          $rootScope.$broadcast('created:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('created:resource' + eventPath, response.resource);
        } else if(response.status === 200) {
          eventPath = eventPath.replace(/:[-\w]+$/, '');
          $rootScope.$broadcast('updated:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('updated:resource' + eventPath, response.resource);
        }

        return response.resource;
      };
      
      this.responseError = emitErrorInterceptor.responseError;
    }
  ])
  .service('emitErrorInterceptor', ['$rootScope', '$q',
    function ($rootScope, $q) {  
      this.responseError = function (error) {
        if(error.status >= 400 && error.status < 500) {
          $rootScope.$broadcast('api:response:4xx', error);
        } else if(error.status >= 500) {
          $rootScope.$broadcast('api:response:5xx', error);
        }
        $rootScope.$broadcast('api:response:' + error.status, error);
        
        return $q.reject(error);
      };
    }
  ]);