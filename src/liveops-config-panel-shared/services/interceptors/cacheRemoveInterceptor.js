'use strict';

angular.module('liveopsConfigPanel.shared.services')
  /** cacheRemoveInterceptor http interceptor service
   * Add as an interceptor to a liveopsResource to remove the response object from the resource's cache
   * Uses the resource's cacheKey property, if defined, or else the resource's resourceName as the cache key
   */
  .service('cacheRemoveInterceptor', ['queryCache',
    function (queryCache) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);
        var keyName = response.resource.cacheKey ? response.resource.cacheKey() : proto.resourceName;

        if(queryCache.get(keyName)) {
          queryCache.get(keyName).removeItem(response.resource);
        }

        return response.resource;
      };
    }
  ]);
