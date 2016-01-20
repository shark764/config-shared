'use strict';

angular.module('liveopsConfigPanel.shared.services')
   /** cacheAddInterceptor http interceptor service
    * Provide as an interceptor for a liveopsResource to automatically add the http response to the resource's cache
    * Uses the resource's cacheKey property, if defined, or else the resource's resourceName as the cache key
    */
  .service('cacheAddInterceptor', ['queryCache',
    function (queryCache) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);
        var keyName = response.resource.cacheKey ? response.resource.cacheKey() : proto.resourceName;
        
        if (!queryCache.get(keyName)) {
          queryCache.put(keyName, []);
        }
        
        queryCache.get(keyName).push(response.resource);

        return response.resource;
      };
    }
  ]);
