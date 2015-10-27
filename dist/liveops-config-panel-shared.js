'use strict';

(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('liveopsConfigPanel.shared.config', [])
    .value('liveopsConfigPanel.shared.config', {
      debug: true
    });

  // Modules
  angular.module('liveopsConfigPanel.shared.directives', []);
  angular.module('liveopsConfigPanel.shared.filters', []);
  angular.module('liveopsConfigPanel.shared.services', [
    'toastr',
    'ngLodash',
    'ngResource',
    'pascalprecht.translate'
  ]);
  angular.module('liveopsConfigPanel.shared', [
    'liveopsConfigPanel.shared.config',
    'liveopsConfigPanel.shared.directives',
    'liveopsConfigPanel.shared.filters',
    'liveopsConfigPanel.shared.services'
  ]);

})(angular);
'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.config', [])

.constant('jsedn', window.jsedn)

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.factory('userStatuses', function() {
  return function(){
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Enabled',
      'value': 'enabled'
    }, {
      'display': 'Pending',
      'value': 'pending'
    }];
  };
})

.factory('statuses', function () {
  return function(){
    return [{
      'display': 'Disabled',
      'value': false
    }, {
      'display': 'Enabled',
      'value': true
    }];
  };
})
.factory('ynStatuses', function () {
  return function(){
    return [{
      'display': 'No',
      'value': false
    }, {
      'display': 'Yes',
      'value': true
    }];
  };
})
.factory('tenantStatuses', function() {
  return function(){
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Expired Invitation',
      'value': 'expired'
    }, {
      'display': 'Pending Invitation',
      'value': 'pending'
    }, {
      'display': 'Accepted',
      'value': 'accepted'
    }, {
      'display': 'Pending Acceptance',
      'value': 'invited'
    }, {
      'display': 'Removed',
      'value': 'removed'
    }];
  };
})

.constant('userStates', [{
  'display': 'Busy',
  'value': 'busy'
}, {
  'display': 'Ready',
  'value': 'ready'
}, {
  'display': 'Not Ready',
  'value': 'not-ready'
}, {
  'display': 'Allocated',
  'value': 'allocated'
}, {
  'display': 'Offline',
  'value': 'offline'
}])

.constant('userRoles', [{
  'value': 'admin',
  'display': 'Admin'
}, {
  'value': 'user',
  'display': 'User'
}, {
  'value': 'other',
  'display': 'Other'
}])

;

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('hasPermission', ['UserPermissions', function (UserPermissions) {
    return function (permissions) {
      if (! angular.isArray(permissions)){
        permissions = [permissions];
      }
      
      return UserPermissions.hasPermissionInList(permissions);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Alert', ['toastr', '$window', function (toastr, $window) {
    this.confirm = function(message, onOk, onCancel){
      if ($window.confirm(message)){
        if (onOk){
          onOk();
        }
      } else {
        if (onCancel){
          onCancel();
        }
      }
    };
    
    this.warning = function(){
      toastr.warning.apply(this, arguments);
    };
    
    this.success = function(){
      toastr.success.apply(this, arguments);
    };
    
    this.error = function(){
      toastr.error.apply(this, arguments);
    };
    
    this.info = function(){
      toastr.info.apply(this, arguments);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('DirtyForms', ['Alert', '$translate', function(Alert, $translate) {
    var self = this;
    this.forms = [];

    this.hasDirty = function() {
      var hasDirty = false;
      angular.forEach(self.forms, function(form) {
        if (form.$dirty) {
          hasDirty = true;
        }
      });

      return hasDirty;
    };

    this.registerForm = function(form) {
      self.forms.push(form);
    };

    this.removeForm = function(form) {
      self.forms.removeItem(form);
    };

    this.confirmIfDirty = function(actionFunction) {
      if (self.hasDirty()) {
        Alert.confirm($translate.instant('unsavedchanges.nav.warning'),
          actionFunction,
          angular.noop
        );
      } else {
        actionFunction();
      }
    };
  }]);

(function() {
  'use strict';

  var flowSetup = function($http, AuthService, $timeout) {
      return {
        seed: function(email, password) {
          var TITAN_REGION_ID;
          var TITAN_ADMIN_ID;
          var CREATED_USER_ID;
          var CREATED_USER_EMAIL;
          var CREATED_TENANT_ID;
          var CREATED_INVITE_TOKEN;
          var CREATED_FLOW_ID;
          var CREATED_VERSION_ID;
          var ACCEPTED_INVITE_STATUS;
          var PLACEHOLDER_ROLE_ID = '10f15d80-0052-11e5-b68b-fb65b1fe22e1';
          return $http.get('http://localhost:9080/v1/regions').then(function(data) {
            TITAN_REGION_ID = data.data.result[0].id;
            console.log('-- TITAN_REGION_ID --', TITAN_REGION_ID);
            return $http.post('http://localhost:9080/v1/login', {email: 'titan@liveops.com', password: 'gKVnfF9wrs6XPSYs'});
          }).then(function(data) {
            TITAN_ADMIN_ID = data.data.result.user.id;
            console.log('-- TITAN_ADMIN_ID --', TITAN_ADMIN_ID);
            return $http.post('http://localhost:9080/v1/users', {
              createdBy: TITAN_ADMIN_ID,
              email: email,
              password: password,
              firstName: 'Test',
              lastName: 'User',
              status: 'enabled',
              externalId: '00000000-0000-0000-000000000000'
            });
          }).then(function(data) {
            CREATED_USER_ID = data.data.result.id;
            CREATED_USER_EMAIL = data.data.result.email;
            console.log('-- CREATED_USER_ID --', CREATED_USER_ID);
            console.log('-- CREATED_USER_EMAIL --', CREATED_USER_EMAIL);
            return $http.post('http://localhost:9080/v1/tenants', {adminUserId: CREATED_USER_ID, createdBy: TITAN_ADMIN_ID, description: 'This is a test tenant created by the seed service.', name: 'Test Tenant', regionId: TITAN_REGION_ID});
          }).then(function(data) {
            CREATED_TENANT_ID = data.data.result.id;
            console.log('-- CREATED TENANT ID --', CREATED_TENANT_ID);
            return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/invites', {roleId: PLACEHOLDER_ROLE_ID, email: CREATED_USER_EMAIL});
          }).then(function(data) {
            CREATED_INVITE_TOKEN = data.data.result.invitation.invitationToken;
            console.log('-- CREATED_INVITE_TOKEN --', CREATED_INVITE_TOKEN);
            console.log('-- LOG IN AS NEW USER --');
            $timeout(function() {
              AuthService.login(email, password)
              .then(function() {
                return $http.get('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/invites/' + CREATED_USER_ID + '/accept?token=' + CREATED_INVITE_TOKEN);
              }).then(function(data) {
                ACCEPTED_INVITE_STATUS = data.data.result;
                console.log('-- ACCEPTED_INVITE_STATUS --', ACCEPTED_INVITE_STATUS);
                return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/flows', {createdBy: CREATED_USER_ID, description: 'Test flow description.', name: 'Test flow', tenantId: CREATED_TENANT_ID, type: 'customer'});
              }).then(function(data) {
                CREATED_FLOW_ID = data.data.result.id;
                console.log('-- CREATED_FLOW_ID --', CREATED_FLOW_ID);
                return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/flows/' + CREATED_FLOW_ID + '/versions', {createdBy: CREATED_USER_ID, description: 'Initial Version.', name: 'v1', flowId: CREATED_FLOW_ID, tenantId: CREATED_TENANT_ID, flow: '[]'});
              }).then(function(data) {
                CREATED_VERSION_ID = data.data.result.version;
                console.log('-- CREATED VERSION ID --', CREATED_VERSION_ID);
                console.log('\n\n Done seeding DB with all necessary data to access the flows screen. Log in as the user "' + email + '" with the password "' + password + '" and access the flows screen and go to town :)');
              });
            }, 5000);
            return AuthService.login(email, password);
          });
        }
      };
    };

  angular.module('liveopsConfigPanel.shared.services')
  .service('flowSetup', flowSetup);
})();
'use strict';

Array.prototype.removeItem = function (item) {
  var idx = this.indexOf(item);
  if (idx > -1){
    this.splice(idx, 1);
  }
};

Array.prototype.clear = function() {
  this.splice(0,this.length);
};

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i === 0 ) { return this; }
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
};
'use strict';

/*global jsedn: false*/
// 
// jsedn.Map.prototype.remove = function(key) {
//   this.keys.splice(key, 1);
//   this.vals.splice(key, 1);
// };
'use strict';

String.prototype.insert = function (index, string) {
  if (index > 0) {
    return this.substring(0, index) + string + this.substring(index, this.length);
  } else {
    return string + this;
  }
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

if (!String.prototype.contains) {
  String.prototype.contains = function(s) {
      return this.indexOf(s) > -1;
  };
}
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('hasPermission', ['UserPermissions', function (UserPermissions) {
    return function (permissions) {
      if (! angular.isArray(permissions)){
        permissions = [permissions];
      }
      
      return UserPermissions.hasPermissionInList(permissions);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('keysCount', [function () {
    return function (obj) {
      return Object.keys(obj).length;
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  //Return the item if the given field matches the given value
  //If no match, returns undefined.
  //Allows matching/search through arrays; use colons in fieldPath to separate layers
  //e.g. "skills:id" will search an object like {name: "name", skills: [{id: "id"}, {id: "other"}]}
  .filter('matchesField', ['$filter', function ($filter) {
    return function (item, fieldPath, value) {
      var findFields = function (item, fieldPath, value) {
        if (angular.isUndefined(item) || angular.isUndefined(fieldPath) || fieldPath === '' || angular.isUndefined(value)){
          return;
        }
        
        var firstColonIndex = fieldPath.indexOf(':');
        if (firstColonIndex > -1){
          var currentPath = fieldPath.substring(0, firstColonIndex);
          var remainingPath = fieldPath.substring(firstColonIndex + 1);
          
          return findFields(item[currentPath], remainingPath, value) ? item : undefined;
        }
        
        if (angular.isArray(item)) {
          for (var i = 0; i < item.length; i++){
            if (item[i][fieldPath] === value){
              return item;
            }
          }
        } else {
          if ($filter('parse')(item, fieldPath) === value) {
            return item;
          }
        }
      };

      return findFields(item, fieldPath, value);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
.filter('objectNegation', function() {
    return function (items, field, otherItems, otherField) {
      var filtered = [];

      angular.forEach(items, function(item){
        var include = true;

        for(var i = 0; i < otherItems.length; i++){
          var otherItem = otherItems[i];

          if(item[field] === otherItem[otherField]){
            include = false;
            break;
          }
        }

        if(include){
          filtered.push(item);
        }
      });

      return filtered;
    };
  });
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('invoke', [function() {
    return function(target, param) {
      if (angular.isFunction(target)) {
        return target.call(param);
      } else {
        return target;
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('parse', ['$parse', function($parse) {
    return function(target, param) {
      return $parse(param)(target);
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('search', ['$parse', function ($parse) {
    return function (items, fields, query) {
      if (!fields || !query) {
        return items;
      }

      function regExpReplace(string) {
        string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        return string.replace(/([*])/g, '.*');
      }

      var findFields = function (field, item) {
        var itemStrings = [];
        var fieldGetter = $parse(field.path);
        var fieldValue = fieldGetter(item);

        if (typeof (fieldValue) === 'string') {
          itemStrings = [fieldValue];
        } else if (typeof (fieldValue) === 'object') {
          angular.forEach(fieldGetter(item), function (result) {
            if ('inner' in field) {
              itemStrings = itemStrings.concat(findFields(field.inner, result));
            } else {
              itemStrings = [result];
            }
          });
        }
        return itemStrings;
      };

      var filtered = [];
      angular.forEach(items, function (item) {

        var wildCardQuery = new RegExp(regExpReplace(query), 'i');
        var itemString = '';

        angular.forEach(fields, function (field) {
          if (typeof (field) === 'string') {
            itemString += $parse(field)(item) + ' ';
          } else if (typeof (field) === 'object') {
            itemString += findFields(field, item).join(' ') + ' ';
          }
        });

        if (wildCardQuery.test(itemString)) {
          filtered.push(item);
        }
      });

      return filtered;
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('selectedOptions', ['$filter', function ($filter) {
    return function (items, field) {
      var filtered = [];
      var options = $filter('invoke')(field.options);
      angular.forEach(items, function (item) {
        var wasAdded = false;
        angular.forEach(options, function (option) {
          var value = $filter('invoke')(option.value, option);
          if (!wasAdded && option.checked &&
            $filter('matchesField')(item, field.name, value)) {

            filtered.push(item);
            wasAdded = true;
          }
        });
      });

      return filtered;
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('selectedTableOptions', ['$parse', '$filter',
    function ($parse, $filter) {
      return function (items, fields) {
        var filtered = [];
        
        if (angular.isUndefined(items)){
          return filtered;
        }
        
        var nothingChecked = true;
        
        for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
          var item = items[itemIndex];
          var showItemInTable = true;
          for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            var matchesColumnFilter = true;
            var field = fields[fieldIndex];
            if(!$parse('header.options')(field)) {
              continue;
            }
            
            var lookup = field.lookup ? field.lookup : field.name;
            var options = $filter('invoke')(field.header.options);
            
            for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              var option = options[optionIndex];
              nothingChecked = nothingChecked && !option.checked;
              if(!option.checked){
                continue;
              }
              
              var parseValue = $parse(field.header.valuePath ? field.header.valuePath : 'value');
              var value = $filter('invoke')(parseValue(option), option);
              
              if ($filter('matchesField')(item, lookup, value)) {
                matchesColumnFilter = true;
                break;
              } else {
                matchesColumnFilter = false;
              }
            }
            
            showItemInTable = showItemInTable && matchesColumnFilter;
          }
          
          if (showItemInTable){
            filtered.push(item);
          }
        }

        return nothingChecked ? items : filtered;
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Alert', ['toastr', '$window', function (toastr, $window) {
    this.confirm = function(message, onOk, onCancel){
      if ($window.confirm(message)){
        if (onOk){
          onOk();
        }
      } else {
        if (onCancel){
          onCancel();
        }
      }
    };
    
    this.warning = function(){
      toastr.warning.apply(this, arguments);
    };
    
    this.success = function(){
      toastr.success.apply(this, arguments);
    };
    
    this.error = function(){
      toastr.error.apply(this, arguments);
    };
    
    this.info = function(){
      toastr.info.apply(this, arguments);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'queryCache', 'lodash',
    function($http, $resource, $q, queryCache, _) {
      function parseResponseResultTransformer(value) {
        if (value.result) {
          return value.result;
        }

        return value;
      }

      function createJsonReplacer(key, value) {
        if (_.startsWith(key, '$')) {
          return undefined;
        } else {
          return value;
        }
      }

      function getInterceptor(interceptorParam) {
        if (angular.isArray(interceptorParam)) {
          var interceptorFunc = function(response) {
            angular.forEach(interceptorParam, function(interceptor) {
              interceptor.response(response);
            });

            return response.resource;
          };

          var interceptor = {
            response: interceptorFunc
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
            queueId: '@queueId',
            userId: '@userId',
            memberId: '@memberId'
          };
          
          var defaultResponseTransformer =
            Array.prototype.concat($http.defaults.transformResponse, parseResponseResultTransformer);
          
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
            Array.prototype.concat(params.putRequestTransformer, defaultResponseTransformer) :
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

          Resource.cachedGet = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;

            var cache = queryCache.get(key);

            if (!cache || invalidate) {
              queryCache.put(key, []);
              cache = queryCache.get(key);
            }

            var item = _.find(cache, params);

            if (!item) {
              item = this.get(params);

              for (var index in params) {
                item[index] = params[index];
              }

              cache.push(item);
            }

            return item;
          };

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
            
            //backup sudo properties such as $user, $groups
            var backup = this.$$backupSudoProperties();

            return action.call(self, params, success, failure)
              .then(function(result) {
                self.$original = angular.copy(result);
                if(self.$original && self.$original.$original) {
                  //Prevent the object from keeping a history, if $original is present on result
                  delete self.$original.$original;
                }
                
                //restore backed-up sudo properties
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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('queryCache', ['$cacheFactory',
    function($cacheFactory) {
      return $cacheFactory('queryCache');
    }]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Modal', ['$document', '$rootScope', '$compile', '$q', function ($document, $rootScope, $compile, $q) {
    var self = this;
    
    this.showConfirm = function(config){
      var defaults = {
        title: '',
        message: '',
        okCallback: angular.noop,
        cancelCallback: angular.noop
      };
      
      var deferred = $q.defer();
      
      var options = angular.extend(defaults, config);
      var newScope = $rootScope.$new();
      
      //Set scope properties for the template to use
      newScope.modalBody = 'app/shared/services/modal/confirmModal.html';
      newScope.title = options.title;
      newScope.message = options.message;
      newScope.okCallback = function(){
        self.close();
        deferred.resolve('true');
        options.okCallback();
      };
      newScope.cancelCallback = function(){
        self.close();
        deferred.reject('false');
        options.cancelCallback();
      };
      
      var element = $compile('<modal></modal>')(newScope);
      $document.find('body').append(element);
      
      return deferred.promise;
    };
    
    this.close = function(){
      $document.find('modal').remove();
    };
  }]);