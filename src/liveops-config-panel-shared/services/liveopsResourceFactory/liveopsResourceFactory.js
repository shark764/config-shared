'use strict';

angular.module('liveopsConfigPanel.shared.services')
  /** liveopsResourceFactory factory
   * Generate a custom ngResource to represent a liveops REST API endpoint
   * 
   * Default behavior:
   *  - Properties on the resource beginning with '$' will not be sent with POST requests
   *  - API responses will have the resultTransformer applied to them to remove the 'result' property
   *  - The resource object will be updated with the response object's properties after an API call
   *  - The $original property of the resource keeps a duplicate of the resource to represent the API copy of the data. $original is updated with every API call
   *  - The $busy property of the resource will be true if there is an unresolved API request pending
   *  
   * Adds the following utility functions to the resource:
   *  - hasItem: Returns true if an object matching the given object's properties is stored in the cache. Returns false otherwise.
   *  - cachedGet: Fetch a matching item from the cache. If not present in cache, do a GET request, add the response to cache, and return the response.
   *  - cachedQuery: Get all items stored in cache for this resource. If the cache is empty, perform a query request, add the response to the cache, and return the response.
   *  - save: If the resource is new, perform a POST request. If the resource is not new (IE has an ID), perform a PUT request
   *  - reset: Discard all changes to this resoruce and restore the resource's properties to $original
   *  - getDisplay: Returns a display string representing this resource instance. Override for more user-friendly results.
   *  - isNew: Returns true if this resource has yet to be POSTed to the API - e.g. it has no ID
   *
   * Accepted configuration for create() is as follows:
   *  - endpoint (string): Full REST url for the resource
   *  - resourceName (string): The name of the resource to create. Used as a cache key and for broadcasting events
   *  - updateFields (array of objects): List of fields that can be updated via PUT. Object is as follows:
   *     - name (string): The object property that can be updated
   *     - optional (boolean): Whether the value can be null or undefined. Default is false
   *  - getInterceptor (interceptor, or array of interceptors): Response interceptors to apply to GET requests for a single object
   *  - queryInterceptor (interceptor, or array of interceptors): Response interceptors to apply to GET requests for an array of object
   *  - saveInterceptor (interceptor, or array of interceptors): Response interceptors to apply to POST requests
   *  - updateInterceptor (interceptor, or array of interceptors): Response interceptors to apply to PUT requests
   *  - requestUrlFields (object): Provide a map of item property names to REST URL variables. See ngResource documentation. Defaults are:
   *        id: '@id',
   *        tenantId: '@tenantId',
   *        groupId: '@groupId',
   *        flowId: '@flowId',
   *        queueId: '@queueId',
   *        userId: '@userId',
   *        memberId: '@memberId'
   *  - Lastly, the create configuration supports a custom request and response transformer for each verb. (See ngResource documentation):
   *        getRequestTransformer, getResponseTransformer
   *        queryRequestTransformer, queryResponseTransformer
   *        putRequestTransformer, putResponseTransformer
   *        postRequestTransformer, postResponseTransformer
   *        deleteRequestTransformer, deleteResponseTransformer
   *  
   */

  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'queryCache', 'lodash', 'resultTransformer',
    function($http, $resource, $q, queryCache, _, resultTransformer) {
      function createJsonReplacer(key, value) {
        if (_.startsWith(key, '$')) {
          return undefined;
        } else {
          return value;
        }
      }

      // ngResource will only accept a single interceptor function. To allow chaining multiple interceptors on one request, 
      // we create a new function that calls all the given interceptor functions
      function getInterceptor(interceptorParam) {
        if (angular.isArray(interceptorParam)) {
          var interceptorFunc = function(response) {
            angular.forEach(interceptorParam, function(interceptor) {
              if(!interceptor.response) {
                return;
              }

              interceptor.response(response);
            });

            return response.resource;
          };

          var interceptorErrorFunc = function(error) {
            angular.forEach(interceptorParam, function(interceptor) {
              if(!interceptor.responseError) {
                return;
              }

              interceptor.responseError(error);
            });

            return $q.reject(error);
          };

          var interceptor = {
            response: interceptorFunc,
            responseError: interceptorErrorFunc
          };

          return interceptor;
        } else {
          return interceptorParam;
        }
      }

      function updateJsonReplacer(key, value) {
        // if the key starts with a $ then its a private field
        // and should NOT be passed to the API
        if (_.startsWith(key, '$')) {
          return undefined;
        }

        return value;
      }

      return {
        create: function(params) {
          function filterUpdateFieldTransformer(data) {
            var cleanedData = angular.copy(data);
            //Remove disallowed fields from the object before we do an update request
            angular.forEach(cleanedData, function(value, key) {
              var i = _.findIndex(params.updateFields, {
                'name': key
              });
              if (i < 0 || (value === null && params.updateFields[i].optional)) {
                delete cleanedData[key];
              }
            });

            return cleanedData;
          }

          function defaultUpdateRequestTransformer(data) {
            var validUpdateFields = filterUpdateFieldTransformer(data);
            return JSON.stringify(validUpdateFields, updateJsonReplacer);
          }

          function defaultSaveRequestTransformer(data) {
            return JSON.stringify(data, createJsonReplacer);
          }

          params.requestUrlFields = angular.isDefined(params.requestUrlFields) ? params.requestUrlFields : {
            id: '@id',
            tenantId: '@tenantId',
            groupId: '@groupId',
            flowId: '@flowId',
            dashboardId: '@dashboardId',
            queueId: '@queueId',
            userId: '@userId',
            memberId: '@memberId'
          };

          var defaultResponseTransformer =
            Array.prototype.concat($http.defaults.transformResponse, resultTransformer);

          var getRequestTransformer = params.getRequestTransformer;
          var getResponseTransformer = params.getResponseTransformer ?
            Array.prototype.concat(params.getResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;

          var queryRequestTransformer = params.queryRequestTransformer;
          var queryResponseTransformer = params.queryResponseTransformer ?
            Array.prototype.concat(params.queryResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;

          var putRequestTransformer = params.putRequestTransformer ?
            Array.prototype.concat(params.putRequestTransformer, defaultUpdateRequestTransformer) :
            defaultUpdateRequestTransformer;
          var putResponseTransformer = params.putResponseTransformer ?
            Array.prototype.concat(params.putResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;

          var postRequestTransformer = params.postRequestTransformer ?
            Array.prototype.concat(params.postRequestTransformer, defaultSaveRequestTransformer) :
            defaultSaveRequestTransformer;
          var postResponseTransformer = params.postResponseTransformer ?
            Array.prototype.concat(params.postResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;

          var deleteRequestTransformer = params.deleteRequestTransformer;
          var deleteResponseTransformer = params.deleteResponseTransformer ?
            Array.prototype.concat(params.deleteResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;

          var defaultHeaders = {
            'Content-Type': 'application/json'
          };

          //Create the ngResource according to our config
          var Resource = $resource(params.endpoint, params.requestUrlFields, {
            query: {
              method: 'GET',
              isArray: true,
              headers: defaultHeaders,
              transformRequest: queryRequestTransformer,
              transformResponse: queryResponseTransformer,
              interceptor: getInterceptor(params.queryInterceptor)
            },

            get: {
              method: 'GET',
              headers: defaultHeaders,
              transformRequest: getRequestTransformer,
              transformResponse: getResponseTransformer,
              interceptor: getInterceptor(params.getInterceptor)
            },

            update: {
              method: 'PUT',
              headers: defaultHeaders,
              transformRequest: putRequestTransformer,
              transformResponse: putResponseTransformer,
              interceptor: getInterceptor(params.updateInterceptor),
            },

            save: {
              method: 'POST',
              headers: defaultHeaders,
              transformRequest: postRequestTransformer,
              transformResponse: postResponseTransformer,
              interceptor: getInterceptor(params.saveInterceptor),
            },

            delete: {
              method: 'DELETE',
              headers: defaultHeaders,
              transformRequest: deleteRequestTransformer,
              transformResponse: deleteResponseTransformer,
              interceptor: getInterceptor(params.saveInterceptor)
            }
          });

          Resource.prototype.resourceName = params.resourceName;

          //Function to store custom properties that would normally be wiped after an API response is handled
          Resource.prototype.$$backupSudoProperties = function() {
            var backup = {};
            angular.forEach(this, function(value, key) {
              if (key.match(/^\$[^$].*/g) &&
                !angular.isFunction(value) &&
                (['$original', '$busy', '$resolved'].indexOf(key) < 0)) {
                backup[key] = value;
              }
            });

            return backup;
          };

          //Function to reset custom properties after an API resposne is handled
          Resource.prototype.$$restoreSudoProperties = function(result, backup) {
            angular.forEach(backup, function(value, key) {
              //if the key is already present, don't overwrite it.
              if(!result[key]) {
                result[key] = value;
              } else if(angular.isObject(value)) {
                angular.extend(result[key], value);
              }
            });
          };

          var proxyGet = Resource.get;
          Resource.get = function(params, success, failure) {
            var getResponse = proxyGet.call(this, params, success, failure);

            getResponse.$promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return getResponse;
          };

          var proxyQuery = Resource.query;
          Resource.query = function(params, success, failure) {
            var getAllResponse = proxyQuery.call(this, params, success, failure);

            getAllResponse.$promise.then(function(results) {
              angular.forEach(results, function(result) {
                result.$original = angular.copy(result);
              });

              return results;
            });

            return getAllResponse;
          };

          var proxySave = Resource.prototype.$save;
          Resource.prototype.$save = function(params, success, failure) {
            var promise = proxySave.call(this, params, success, failure);

            promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return promise;
          };

          var proxyUpdate = Resource.prototype.$update;
          Resource.prototype.$update = function(queryParams, success, failure) {
            var promise = proxyUpdate.call(this, queryParams, success, failure);

            promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return promise;
          };

          Resource.hasItem = function(params, cacheKey) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            var cache = queryCache.get(key);

            if(!cache) {
              return false;
            }

            var item = _.find(cache, params);
            return !!item;
          };

          //cacheKey defaults to the resource resourceName
          //If invalidate is truthy, overwrite the existing cache with the response
          //Provide keyParams if you need custom identifiers for searching the cache for a match. Defaults to value of params
          Resource.cachedGet = function(params, cacheKey, invalidate, keyParams) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            keyParams = keyParams ? keyParams : params;
            
            var cache = queryCache.get(key);

            if (!cache || invalidate) {
              queryCache.put(key, []);
              cache = queryCache.get(key);
            }

            var item = _.find(cache, keyParams);

            if (!item) {
              item = this.get(params);

              for (var index in params) {
                item[index] = params[index];
              }

              cache.push(item);
              cache.$promise = item.$promise;
            }

            return item;
          };

          //cacheKey defaults to the resource resourceName
          //If invalidate is truthy, overwrite the existing cache with the response
          Resource.cachedQuery = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            if (!queryCache.get(key) || invalidate) {
              var items = this.query(params);
              queryCache.put(key, items);
              return items;
            }

            return queryCache.get(key);
          };

          Resource.prototype.save = function(params, success, failure) {
            var self = this,
                action = this.isNew() ? this.$save : this.$update;

            self.$busy = true;

            //backup pseudo-properties such as $user, $groups
            var backup = this.$$backupSudoProperties();

            return action.call(self, params, success, failure)
              .then(function(result) {
                self.$original = angular.copy(result);
                if(self.$original && self.$original.$original) {
                  //Prevent the object from keeping a history, if $original is present on result
                  delete self.$original.$original;
                }

                //restore backed-up pseudo-properties
                self.$$restoreSudoProperties(result, backup);

                return result;
              }).finally(function() {
                self.$busy = false;
              });
          };

          Resource.prototype.reset = function() {
            for (var prop in this.$original) {
              if (prop.match(/^\$.*/g) ||
                angular.isFunction(this.$original[prop])) {
                continue;
              }
              this[prop] = angular.copy(this.$original[prop]);
            }
          };

          Resource.prototype.getDisplay = function() {
            return this.toString();
          };

          Resource.prototype.isNew = function() {
            return !(this.hasOwnProperty('created') || angular.isDefined(this.id));
          };

          Resource.prototype.$busy = false;

          return Resource;
        }
      };
    }
  ]);
