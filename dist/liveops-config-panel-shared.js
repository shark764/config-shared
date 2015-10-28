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
  angular.module('liveopsConfigPanel.shared.directives', [
    'liveopsConfigPanel.shared.services',
    'liveopsConfigPanel.shared.filters'
  ]);
  angular.module('liveopsConfigPanel.shared.filters', []);
  angular.module('liveopsConfigPanel.shared.services', [
    'toastr',
    'ngLodash',
    'ngResource',
    'pascalprecht.translate',
    'liveopsConfigPanel.shared.config'
  ]);
  angular.module('liveopsConfigPanel.shared', [
    'liveopsConfigPanel.shared.config',
    'liveopsConfigPanel.shared.directives',
    'liveopsConfigPanel.shared.filters',
    'liveopsConfigPanel.shared.services'
  ]);

})(angular);
angular.module('liveopsConfigPanel.shared.config')
  .constant('apiHostname', 'http://localhost:9080')
  .constant('BIRST_URL', 'http://dev-birst.liveopslabs.com')
  .constant('SSO_PASSWORD', 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh')
  .constant('SPACE_ID', '2846b565-23f8-4032-b563-21f8b7a01cc5')
  .constant('helpDocsHostname', 'http://beta-help-docs.liveopslabs.com');

'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.shared.config')

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

angular.module('liveopsConfigPanel.mock', [])
  .value('mockRegions', [{
    'id': 'regionId1',
    'description': 'US East (N. Virginia)',
    'name': 'us-east-1'
  }])
  .value('mockLogin', {
    userId: 'userId1',
    username: 'username',
    platformPermissions: [],
    tenants: []
  })
  .run(function($httpBackend, apiHostname, mockRegions, mockLogin, Session) {
    Session.token = 'token1';

    Session.tenant = {
      tenantId: 'tenant-id'
    };

    Session.user = {
      id: 'userId1'
    };

    Session.activeRegionId = mockRegions[0].id;
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
      'result': mockRegions
    });
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({
      'result': mockLogin
    });
  });

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

angular.module('liveopsConfigPanel.shared.directives')
  .directive('auditText', ['$filter', 'TenantUser', 'Session',
    function ($filter, TenantUser, Session) {
      return {
        restrict: 'AE',
        scope: {
          translation: '@',
          userId: '=',
          date: '='
        },
        template: '{{get()}}',
        link: function ($scope) {
          $scope.get = function () {
            if (!$scope.userId) {
              return  $filter('translate')($scope.translation, {
                date: $filter('date')($scope.date, 'medium')
              });
            }

            var user = TenantUser.cachedGet({
              id: $scope.userId,
              tenantId: Session.tenant.tenantId
            }, 'AuditTextUsers');

            if(user.$resolved) {
              $scope.text = $filter('translate')($scope.translation, {
                displayName: user.getDisplay(),
                date: $filter('date')($scope.date, 'medium')
              });
            }

            return $scope.text;
          };
        }
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('autocomplete', ['filterFilter', '$timeout', function(filterFilter, $timeout) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        nameField: '@',
        onSelect: '&',
        prefill: '=',
        isRequired: '=',
        placeholder: '@',
        hover: '=',
        keepExpanded: '=',
        onEnter: '&'
      },

      templateUrl: 'liveops-config-panel-shared/directives/autocomplete/autocomplete.html',

      link: function($scope) {
        $scope.currentText = $scope.prefill || '';

        $scope.$watch('currentText', function() {
          var filteredItems;

          if ($scope.nameField) {
            var filterCriteria = $scope.filterCriteria = {};
            filterCriteria[$scope.nameField] = $scope.currentText;
            filteredItems = filterFilter($scope.items, filterCriteria, true);
          }

          $timeout(function() {
            $scope.onSelect({currentText: $scope.currentText});
          });
        });

        $scope.select = function(item) {
          $scope.hovering = false;
          $scope.currentText = item.content;
        };

        $scope.onBlur = function() {
          if (!$scope.keepExpanded) { //Prevents the button in multibox from jumping around
            $scope.showSuggestions = false;
          }
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .service('BulkAction', ['$q',
    function ($q) {
      var BulkAction = function () {
        this.checked = false;
      };

      BulkAction.prototype.reset = function () {
        this.checked = false;
      };
      
      BulkAction.prototype.apply = function () {};

      BulkAction.prototype.execute = function (items) {
        var promises = [];
        var self = this;
        angular.forEach(items, function (item) {
          promises.push($q.when(self.apply(item)));
        });

        return $q.all(promises);
      };

      BulkAction.prototype.canExecute = function () {
        return true;
      };

      return BulkAction;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('bulkActionExecutor', ['$q', 'Alert', 'Modal', '$translate', 'DirtyForms', '$filter',
    function ($q, Alert, Modal, $translate, DirtyForms, $filter) {
      return {
        restrict: 'AE',
        replace: true,
        scope: {
          items: '=',
          bulkActions: '=',
          showBulkActions: '=',
          dropOrderBy: '@',
          confirmMessageKey: '@'
        },
        transclude: true,
        templateUrl: 'liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        link: function ($scope) {
          if (! $scope.confirmMessageKey){
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }

          $scope.checkedItems = [];

          $scope.confirmExecute = function () {
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant($scope.confirmMessageKey, {
                numItems: $scope.selectedItems().length
              }),
              okCallback: $scope.execute
            });
          };

          $scope.closeBulk = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.$emit('details:panel:close');
            });
          };

          $scope.execute = function () {
            var selectedBulkActions = $scope.getSelectedBulkActions($scope.bulkActions);
            var itemPromises = [];

            //Prevent unsaved changes warning from triggering if all items are
            //filtered out of the table and the bulk actions panel auto-closes
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();

            angular.forEach(selectedBulkActions, function (bulkAction) {
              if (bulkAction.canExecute()) {
                var selectedItems = $scope.getSelectedBulkActions($scope.items);
                itemPromises.push($q.when(bulkAction.execute(selectedItems)));
              }
            });

            var promise = $q.all(itemPromises).then(function () {
              Alert.success($translate.instant('bulkAction.success'));
              $scope.resetForm();
            });

            return promise;
          };

          $scope.canExecute = function () {
            var selectedBulkActions = $scope.getSelectedBulkActions($scope.bulkActions);
            var canExecute = !!selectedBulkActions.length;

            if( $scope.selectedItems().length === 0 ){
              return false;
            }

            angular.forEach(selectedBulkActions, function (bulkAction) {
              canExecute = canExecute && bulkAction.canExecute();
            });

            return canExecute;
          };

          $scope.getSelectedBulkActions = function (items) {
            var selectedItems = [];
            angular.forEach(items, function (item) {
              if (item.checked) {
                selectedItems.push(item);
              }
            });

            return selectedItems;
          };

          $scope.selectedItems = function () {
            $scope.checkedItems.clear();
            angular.forEach($scope.items, function (item) {
              if(item.checked) {
                $scope.checkedItems.push(item);
              }
            });

            if ($scope.dropOrderBy){
              //Reorder elements while preserving original object reference to avoid infinite digest loop
              var sorted = $filter('orderBy')($scope.checkedItems, $scope.dropOrderBy);
              $scope.checkedItems.clear();
              $scope.checkedItems.push.apply($scope.checkedItems, sorted);
            }

            return $scope.checkedItems;
          };

          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              if ($scope.bulkActionForm.$dirty){
                $scope.resetForm();
              } else {
                $scope.closeBulk();
              }
            });
          };

          $scope.resetForm = function () {
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            angular.forEach($scope.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

          $scope.$watch('showBulkActions', function (newValue) {
            if (!newValue) {
              $scope.resetForm();
            }
          });
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives.bulkAction.mock', ['liveopsConfigPanel.mock'])
  .service('mockBulkActions', function (BulkAction) {
    var bulkActions = [new BulkAction()];
    bulkActions[0].checked = true;
    spyOn(bulkActions[0], 'execute');
    spyOn(bulkActions[0], 'canExecute').and.returnValue(true);

    bulkActions.push(new BulkAction());
    bulkActions[1].checked = true;
    spyOn(bulkActions[1], 'execute');
    spyOn(bulkActions[1], 'canExecute').and.returnValue(false);
    
    return bulkActions;
  });
'use strict';

/**
  Based on Zach Snow's blog post entitled AngularJS: Faster ng-include

  http://zachsnow.com/#!/blog/2014/angularjs-faster-ng-include/
**/

angular.module('liveopsConfigPanel.shared.directives')
  .directive('compiledInclude', [
  '$compile',
  '$templateCache',
  '$http',
  '$q',
  function($compile, $templateCache, $http, $q) {
    return {
      restrict: 'A',
      priority: 400,
      compile: function(){
        // In an ideal world, if we could hard-code the template URLs, we could
        // do all of the below in this compile function. Unfortunately, Since
        // we do not know what template will be needed, we have to rely on the
        // pre-link function (the return value of this)

        return function($scope, element, attrs){
          var templateName = attrs.compiledInclude,
              template = $templateCache.get(templateName);

          if(!template){

            // If we have no template, lets go fetch it. When we do, store it in cache.
            // This can cause multiple queries for the same template, but once one puts in
            // the cache, all future calls will be able to retrieve it from cache.
            template = $http.get(templateName, {cache: $templateCache}).then(function (result){
              $templateCache.put(templateName, result.data);
              return result.data;
            });
          }

          // Since we don't know if we're waiting for a promise or just have the value,
          // use $q.when to handle both cases
          $q.when(template).then(function (templateHtml) {
            element.html(templateHtml);
            $compile(element.contents())($scope);
          });
        };
      }
    };
  }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loCancel', ['$q',
    function ($q) {
      return {
        restrict: 'A',
        require: ['^loFormCancel'],
        link: function ($scope, $elem, $attrs, $ctrl) {
          $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

          $elem.bind($attrs.event, function () {
            var promise = $q.when($scope.$eval($attrs.loCancel));

            promise.then(function () {
              return $ctrl[0].cancel();
            });

            $scope.$apply();
          });
        }
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormAlert', ['$parse', 'Alert',
    function ($parse, Alert) {
      return {
        restrict: 'A',
        require: ['loFormSubmit'],
        controller: function() {
          this.alertSuccess = function(resource) {
            var action = resource.updated ? 'updated' : 'saved';
            Alert.success('Record ' + action);
          };

          this.alertFailure = function(resource) {
            var action = resource.updated ? 'update' : 'save';
            Alert.error('Record failed to ' + action);
          };
        },
        link: function ($scope, elem) {
          $scope.$on('form:submit:success', function(event, resource) {
            var controller = elem.data('$loFormAlertController');
            controller.alertSuccess(resource);
          });

          $scope.$on('form:submit:failure', function(event, resource) {
            var controller = elem.data('$loFormAlertController');
            controller.alertFailure(resource);
          });
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormCancel', ['$parse', 'DirtyForms', '$timeout', '$rootScope',
    function ($parse, DirtyForms, $timeout, $rootScope) {
      return {
        restrict: 'A',
        require: ['ngResource', 'form', '^loDetailsPanel'],
        controller: function($scope) {
          var self = this;
          //TODO: Use loFormReset instead.
          this.resetForm = function () {
            //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
            //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
            angular.forEach(self.formController, function (value, key) {
              if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
                var displayValue = value.$modelValue;
                if (displayValue === null) {
                  displayValue = undefined;
                }

                self.formController[key].$setViewValue(displayValue);
                self.formController[key].$rollbackViewValue();
              }
            });

            self.formController.$setPristine();
            self.formController.$setUntouched();
          };

          this.cancel = function () {
            var resource = $parse(this.ngResource)($scope);
            if (resource.isNew() || !this.formController.$dirty) {
             this.loDetailsPanelController.close();
            } else {
              DirtyForms.confirmIfDirty(function () {
                $rootScope.$broadcast('cancel:resource:' + resource.resourceName);
                resource.reset();
                $timeout(function(){
                  self.resetForm(self.formController);
                });
              });
            }
          };
        },
        link: function ($scope, $elem, $attrs, $ctrl) {
          $scope.$watch($attrs.ngResource, function(newResource, oldResource) {
            if(oldResource) {
              oldResource.reset();
            }

            var form = $parse($attrs.name)($scope);
            var controller = $elem.data('$loFormCancelController');
            controller.resetForm(form);
          });

          var controller = $elem.data('$loFormCancelController');
          controller.ngResource = $attrs.ngResource;
          controller.formController = $ctrl[1];
          controller.loDetailsPanelController = $ctrl[2];
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormReset', [
    function () {
      return {
        restrict: 'A',
        require: 'form',
        controller: function() {
          var self = this;
          
          this.resetForm = function () {
            //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
            //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
            angular.forEach(self.formController, function (value, key) {
              if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
                var displayValue = value.$modelValue;
                if (displayValue === null) {
                  displayValue = undefined;
                }

                self.formController[key].$setViewValue(displayValue);
                self.formController[key].$rollbackViewValue();
              }
            });

            self.formController.$setPristine();
            self.formController.$setUntouched();
          };
        },
        link: function ($scope, $elem, $attrs, form) {
          var controller = $elem.data('$loFormResetController');
          controller.formController = form;
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormSubmit', ['$parse',
    function($parse) {
      return {
        restrict: 'A',
        require: 'form',
        controller: function($scope) {
          var self = this;
          
          self.errorInputWatchesUnbinds = {};
          
          this.populateApiErrors = function(error) {
            if ($parse('data.error')(error)) {
              angular.forEach(error.data.error.attribute, function(value, key) {
                if (angular.isDefined(self.formController[key])){
                  self.formController[key].$setValidity('api', false);
                  self.formController[key].$error = {
                    api: value
                  };
                  self.formController[key].$setTouched();
                  self.formController[key].$setPristine();
                  
                  self.errorInputWatchesUnbinds[key] = $scope.$watch(function(){
                    return self.formController[key].$dirty;
                  }, function(dirtyValue){
                    if (dirtyValue){
                      self.formController[key].$setValidity('api', true);
                      self.errorInputWatchesUnbinds[key]();
                      delete self.errorInputWatchesUnbinds[key];
                    }
                  });
                }
              });
            }

            return error;
          };
        },
        link: function($scope, $elem, $attrs, form) {
          var controller = $elem.data('$loFormSubmitController');
          controller.formController = form;
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmit', ['$q', '$parse', function ($q, $parse) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit', '?^loFormCancel', '?^loFormAlert', '?^loFormReset'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';
        
        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        var loFormAlert = $ctrl[2];
        var loFormReset = $ctrl[3];
        
        $elem.bind($attrs.event, function () {
          var ngDisabled = $parse($attrs.ngDisabled)($scope);
          if(!!ngDisabled){
            return;
          }
          
          //TODO check if $attrs.loSubmit is actually a thing that return resource
          var promise = $q.when($scope.$eval($attrs.loSubmit));
          
          promise = promise.then(function(resource) {
            if(loFormCancel) {
              loFormCancel.resetForm();
            } else if (loFormReset) {
              loFormReset.resetForm();
            }
            
            return resource;
          },
          function(error) {
            var def = $q.defer();
            loFormSubmit.populateApiErrors(error);
            def.reject(error);
            return def.promise;
          });
          
          promise = promise.then(function(resource) {
            loFormAlert.alertSuccess(resource);
          }, 
          function(error) {
            loFormAlert.alertFailure(error.config.data);
          });
          
          $scope.$apply();
        });
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('ngResource', [function () {
    return {
      restrict: 'A',
      controller: function() {
        //TODO: validate resource object
      }
    };
  }]);

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

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel.shared.services')
  .service('Session', ['$rootScope', 'sessionKey', 'preferenceKey', '$translate', '$filter',
    function ($rootScope, sessionKey, preferenceKey, $translate, $filter) {
      var self = this;

      this.userSessionKey = sessionKey;
      this.userPreferenceKey = preferenceKey;

      this.token = null;
      this.user = null;
      this.lang = null;
      this.tenants = null;
      this.tenant = null;
      this.activeRegionId = null;
      this.columnPreferences = {};
      this.platformPermissions = null;

      this.set = function (user, tenants, token, platformPermissions) {
        this.token = token;
        this.setUser(user);
        this.setTenants(tenants);
        this.setPlatformPermissions(platformPermissions);
        
        this.flush();
      };

      this.setTenants = function (tenants){

        if(tenants && tenants.length > 0){
          this.tenants = tenants;
        } else {
          this.tenants = [{
            tenantId: '',
            name: $translate.instant('session.tenants.none')
          }];
        }

        if (this.tenant){
          //Keep the previously selected tenant
          var matches = $filter('filter')(this.tenants, {tenantId: this.tenant.tenantId});
          if (matches.length > 0){
            this.tenant = matches[0];
          } else {
            this.tenant = this.tenants[0];
          }
        } else {
          this.tenant = this.tenants[0];
        }

        this.flush();
      };  

      this.setUser = function (user) {
        this.user = {
          id: user.id,
          displayName: user.getDisplay(),
          email: user.email
        };
        this.flush();
      };

      this.setToken = function (token) {
        this.token = token;
        this.flush();
      };
      
      this.setPlatformPermissions = function(platformPermissions){
        this.platformPermissions = platformPermissions;
        this.flush();
      };

      this.setColumnPreferences = function(columnPreferences){
        this.columnPreferences = columnPreferences;
        this.flush();
      };

      this.destroy = function () {
        this.token = null;
        this.user = null;
        this.tenants = null;
        this.platformPermissions = null;
        
        localStorage.removeItem(this.userSessionKey);
      };

      this.setTenant = function (tenant) {
        self.tenant = {
          tenantId: tenant.tenantId,
          tenantName: tenant.tenantName,
          tenantPermissions: tenant.tenantPermissions
        };
        self.flush();
      };

      this.destroyAll = function () {
        this.destroy();
        this.activeRegionId = null;
        this.lang = 'en';
        this.tenant = null;
        localStorage.removeItem(this.userPreferenceKey);
      };

      this.restore = function () {
        angular.extend(this, JSON.parse(localStorage.getItem(this.userSessionKey)));
        angular.extend(this, JSON.parse(localStorage.getItem(this.userPreferenceKey)));

        //if (this.lang) {
        //  $translate.use(this.lang);
        //}
      };

      this.isAuthenticated = function () {
        if (! this.token){
          return false;
        } else {
          return this.token.indexOf('Token') < 0; //Prevent page load error when still authenticated with temp token
        }

      };

      this.flush = function () {
        localStorage.setItem(self.userSessionKey, JSON.stringify({
          token: self.token,
          user: self.user,
          tenants: self.tenants,
          platformPermissions: self.platformPermissions
        }));

        localStorage.setItem(self.userPreferenceKey, JSON.stringify({
          lang: self.lang,
          activeRegionId: self.activeRegionId,
          tenant: self.tenant,
          columnPreferences: self.columnPreferences
        }));
      };

      this.restore();
    }
  ]);

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
  .service('emitInterceptor', ['$rootScope', '$q', '$location', 'apiHostname',
    function ($rootScope, $q, $location, apiHostname) {
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
'use strict';

angular.module('liveopsConfigPanel.tenant.group.mock', ['liveopsConfigPanel.mock'])
  .service('mockGroups', function(Group) {
    return [new Group({
      'id': 'groupId1',
      'name': 'groupName1',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId2',
      'name': 'groupName2',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId3',
      'name': 'groupName3',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId100',
      'name': 'groupName100',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups',
    function($httpBackend, apiHostname, mockGroups) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1').respond({
        'result': mockGroups[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2').respond({
        'result': mockGroups[1]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId3').respond({
        'result': mockGroups[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': [mockGroups[0], mockGroups[1], mockGroups[2]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': mockGroups[3]
      });

      $httpBackend.when('GET', apiHostname + '/v1/groups/groupId0').respond(404);
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Group', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {

      var Group = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:id',
        resourceName: 'Group',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'owner'
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Group.prototype.getDisplay = function () {
        return this.name;
      };

      return Group;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.permission.mock', ['liveopsConfigPanel.mock'])
  .service('mockTenantPermissions', function(TenantPermission) {
    return [new TenantPermission({
      'id': 'permissionId1',
      'name': 'PERMISSION_1',
      'tenantId': 'tenant-id'
    }), new TenantPermission({
      'id': 'permissionId2',
      'name': 'PERMISSION_2',
      'tenantId': 'tenant-id'
    }), new TenantPermission({
      'id': 'permissionId3',
      'name': 'PERMISSION_3',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenantPermissions',
    function($httpBackend, apiHostname, mockTenantPermissions) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissions').respond({
        'result': [mockTenantPermissions[0], mockTenantPermissions[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId1').respond({
        'result': mockTenantPermissions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId2').respond({
        'result': mockTenantPermissions[1]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId3').respond({
        'result': mockTenantPermissions[2]
      });
    }
  ])
  .service('mockPlatformPermissions', function(PlatformPermission) {
    return [new PlatformPermission({
      'id': 'permissionId1',
      'name': 'PLATFORM_PERMISSION_1'
    }), new PlatformPermission({
      'id': 'permissionId2',
      'name': 'PLATFORM_PERMISSION_1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockPlatformPermissions',
    function($httpBackend, apiHostname, mockPlatformPermissions) {
      $httpBackend.when('GET', apiHostname + '/v1/permissions').respond({
        'result': [mockPlatformPermissions[0], mockPlatformPermissions[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/permissions/permissionId1').respond({
        'result': mockPlatformPermissions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/permissions/permissionId2').respond({
        'result': mockPlatformPermissions[1]
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('PlatformPermission', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var PlatformPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/permissions/:id',
        resourceName: 'PlatformPermission',
        updateFields: []
      });

      PlatformPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return PlatformPermission;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('PlatformRole', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
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
        }]
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

'use strict';

angular.module('liveopsConfigPanel.tenant.role.mock', ['liveopsConfigPanel.mock'])
  .service('mockRoles', function(TenantRole) {
    return [new TenantRole({
      'id': 'roleId1',
      'name': 'roleName1',
      'tenantId': 'tenant-id',
      'permissions': []
    }), new TenantRole({
      'id': 'roleId2',
      'name': 'roleName2',
      'tenantId': 'tenant-id',
      'permissions': []
    }), new TenantRole({
      'id': 'roleId3',
      'name': 'roleName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id',
      'permissions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockRoles',
    function($httpBackend, apiHostname, mockRoles) {
      //GET tenants/roles
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles').respond({
        'result': [mockRoles[0], mockRoles[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond({
        'result': mockRoles[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles/roleId2').respond({
        'result': mockRoles[1]
      });
    }
  ])
  .service('mockPlatformRoles', function(PlatformRole) {
    return [new PlatformRole({
      'id': 'roleId1',
      'name': 'roleName1',
      'permissions': []
    }), new PlatformRole({
      'id': 'roleId2',
      'name': 'roleName2',
      'permissions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockPlatformRoles',
    function($httpBackend, apiHostname, mockPlatformRoles) {
      $httpBackend.when('GET', apiHostname + '/v1/roles').respond({
        'result': [mockPlatformRoles[0], mockPlatformRoles[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/roles/roleId1').respond({
        'result': mockPlatformRoles[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/roles/roleId2').respond({
        'result': mockPlatformRoles[1]
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantPermission', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var TenantPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/permissions/:id',
        resourceName: 'TenantPermission',
        updateFields: []
      });

      TenantPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return TenantPermission;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantRole', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'cacheAddInterceptor', 'emitInterceptor',
    function(LiveopsResourceFactory, apiHostname, Session, cacheAddInterceptor, emitInterceptor) {
      var TenantRole = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/roles/:id',
        resourceName: 'TenantRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions'
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor]
      });

      TenantRole.prototype.getDisplay = function() {
        return this.name;
      };

      TenantRole.getName = function(roleId) {
        return TenantRole.cachedGet({
          tenantId: Session.tenant.tenantId,
          id: roleId
        }).name;
      };

      return TenantRole;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.tenant.skill.mock', ['liveopsConfigPanel.mock'])
  .service('mockSkills', function(Skill) {
    return [new Skill({
      'id': 'skillId1',
      'name': 'skillName1',
      'tenantId': 'tenant-id',
      'hasProficiency': true
    }), new Skill({
      'id': 'skillId2',
      'name': 'skillName2',
      'tenantId': 'tenant-id',
      'hasProficiency': false
    }), new Skill({
      'id': 'skillId3',
      'name': 'skillName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id',
      'hasProficiency': false
    })];
  })
  .service('mockUserSkills', function(TenantUserSkill) {
    return [new TenantUserSkill({
      'skillId': 'skillId1',
      'tenantId': 'tenant-id',
      'userId': 'userId1',
      'proficiency': 0
    }), new TenantUserSkill({
      'skillId': 'skillId1',
      'tenantId': 'tenant-id',
      'userId': 'userId2',
      'proficiency': 5
    }), new TenantUserSkill({
      'skillId': 'skillId2',
      'tenantId': 'tenant-id',
      'userId': 'userId1',
      'proficiency': 8
    }), new TenantUserSkill({
      'skillId': 'skillId3',
      'tenantId': 'tenant-id',
      'userId': 'userId2',
      'proficiency': 10
    })];
  })
  .service('mockSkillUsers', function(TenantSkillUser) {
    return [new TenantSkillUser({
      'userId': 'userId1',
      'proficiency': 0
    }), new TenantSkillUser({
      'userId': 'userId2',
      'proficiency': 5
    }), new TenantSkillUser({
      'userId': 'userId1',
      'proficiency': 8
    }), new TenantSkillUser({
      'userId': 'userId2',
      'proficiency': 10
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockSkills', 'mockUserSkills', 'mockSkillUsers',
    function($httpBackend, apiHostname, mockSkills, mockUserSkills, mockSkillUsers) {
      //GET tenants/skills
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills').respond({
        'result': [mockSkills[0], mockSkills[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId1').respond({
        'result': mockSkills[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId2').respond({
        'result': mockSkills[1]
      });

      //GET tenants/user/skills
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond({
        'result': [mockUserSkills[0], mockUserSkills[2]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2/skills').respond({
        'result': [mockUserSkills[1]]
      });

      //GET tenants/skills/user
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId1/users').respond({
        'result': [mockSkillUsers[0], mockSkillUsers[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId2/users').respond({
        'result': [mockSkillUsers[2]]
      });

      //POST tenants/skills
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/skills').respond({
        'result': mockSkills[2]
      });

      //POST tenants/users/skills
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond({
        'result': mockUserSkills[2]
      });

      //DELETE tenants/users/skills
      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond(200);

      //PUT tenants/users/skills
      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond({
        'result': mockUserSkills[0]
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Skill', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {
      var Skill = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:id',
        resourceName: 'Skill',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'hasProficiency'
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Skill.prototype.getDisplay = function () {
        return this.name;
      };

      return Skill;
    }
  ]);
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

      if(tenantUser.userId) {
        rename(tenantUser, 'userId', 'id');
      }

      moveToUser(tenantUser, 'firstName');
      moveToUser(tenantUser, 'lastName');
      moveToUser(tenantUser, 'externalId');
      moveToUser(tenantUser, 'personalTelephone');
      moveToUser(tenantUser, 'platformStatus', 'status');

      copyToUser(tenantUser, 'id');
      copyToUser(tenantUser, 'email');

      rename(tenantUser, 'groups', '$groups');
      rename(tenantUser, 'skills', '$skills');

      if(tenantUser.roleName) {
        rename(tenantUser, 'roleName', '$roleName');
      } else {
        tenantUser.$roleName = TenantRole.getName(tenantUser.roleId);
      }

      //Required so that we can get a cache hit on TenantUser.cachedGet
      tenantUser.tenantId = Session.tenant.tenantId;

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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUser', ['LiveopsResourceFactory', 'apiHostname', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, tenantUserInterceptor, tenantUserQueryInterceptor, cacheAddInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }, {
          name: 'extensions'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor,
        saveInterceptor: [tenantUserInterceptor, cacheAddInterceptor],
        updateInterceptor: tenantUserInterceptor
      });

      TenantUser.prototype.getDisplay = function () {
        if (this.$user) { //TODO: update unit tests and mocks to all have $user
          return this.$user.getDisplay();
        }
      };

      var reset = TenantUser.prototype.reset;

      TenantUser.prototype.reset = function () {
        reset.call(this);
        
        this.$user.reset();
      };
      
      TenantUser.prototype.isNew = function() {
        return !this.id;
      };
      
      return TenantUser;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.user.mock',
  ['liveopsConfigPanel.mock', 'liveopsConfigPanel.tenant.role.mock'])
  .service('mockTenantUsers', function (TenantUser) {
    return [new TenantUser({
      'id': 'userId1',
      'status': 'pending',
      'externalId': 73795,
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': []
    }), new TenantUser({
      'id': 'userId2',
      'status': 'enabled',
      'externalId': 80232,
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': []
    }), new TenantUser({
      'email': 'test1@bluespurs.com',
      'createdBy': 'userId1',
      'personalTelephone': null,
      'platformStatus': 'pending',
      'firstName': 'test',
      'created': '2015-08-19T13:25:13Z',
      'state': 'offline',
      'extension': 'ca027450_4673_11e5_bded_621c6d9e2761',
      '$skills': [],
      'externalId': '56789',
      'status': 'invited',
      'id': 'userId100',
      'lastName': '1',
      'groups': [{
        'tenantId': 'tenant-id',
        'memberId': 'userId1',
        'groupId': 'groupId1',
        'added': '2015-08-19T13:25:13Z',
        'memberType': 'user',
        'name': 'everyone',
        'ower': 'userId1',
        'description': 'everyone group'
      }],
      'roleId': 'roleId1'
    }), new TenantUser({
      'tenantId': 'tenantId',
      'email': 'test1@bluespurs.com',
      'createdBy': 'userId1',
      'sessionReason': null,
      'invitationExpiryDate': '2015-08-20T13:36:11Z',
      'updated': null,
      'created': '2015-08-19T13:36:11Z',
      'state': 'offline',
      'extension': '41903310_4677_11e5_bded_621c6d9e2761',
      'updatedBy': null,
      'status': 'invited',
      'userId': 'userId100',
      'sessionStarted': '2015-08-19T13:36:11Z',
      'roleId': 'roleId1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenantUsers',
    function ($httpBackend, apiHostname, mockTenantUsers) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond({
        'result': mockTenantUsers[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2').respond({
        'result': mockTenantUsers[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId100').respond({
        'result': mockTenantUsers[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users').respond({
        'result': [mockTenantUsers[0], mockTenantUsers[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/userId').respond(404);

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/users').respond(mockTenantUsers[3]);
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantGroupUsers', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:groupId/users/:memberId',
        resourceName: 'TenantGroupUser',
        requestUrlFields: {
          tenantId: '@tenantId',
          groupId: '@groupId',
          memberId: '@memberId'
        }
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:memberId/groups',
        resourceName: 'TenantUserGroup',
        requestUrlFields: {
          tenantId: '@tenantId',
          memberId: '@memberId'
        }
      });

    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.user.group.mock', [
  'liveopsConfigPanel.mock'])
  .service('mockGroupUsers', function(TenantGroupUsers) {
    return [new TenantGroupUsers({
      'groupId': 'groupId1',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantGroupUsers({
      'groupId': 'groupId2',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantGroupUsers({
      'groupId': 'groupId1',
      'memberId': 'userId2',
      'tenantId': 'tenant-id'
    })];
  })
  .service('mockUserGroups', function(TenantUserGroups) {
    return [new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantUserGroups({
      'groupId': 'groupId2',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId2',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups', 'mockGroupUsers', 'mockUserGroups', 'Session',
    function($httpBackend, apiHostname, mockGroups, mockGroupUsers, mockUserGroups, Session) {
      Session.tenant.tenantId = 'tenant-id';

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users', {
        userId: 'userId1'
      }).respond(200, mockUserGroups[1]);

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users', {
        userId: 'userId1'
      }).respond(200, mockUserGroups[1]);

      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1')
        .respond(200);

      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId2')
        .respond(200);

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/groups').respond({
        'result': [mockUserGroups[0], mockUserGroups[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2/groups').respond({
        'result': [mockUserGroups[2]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond({
        'result': [mockGroupUsers[0], mockGroupUsers[2]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users').respond({
        'result': [mockGroupUsers[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId3/users').respond({
        'result': []
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('removeDefaultProficiencyInterceptor', ['queryCache', 'Skill', 'Session', 'filterFilter',
    function (queryCache, Skill, Session, filterFilter) {
      this.response = function (response) {
        var skillId = response.resource.skillId;
        Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function(skills){
          var matching = filterFilter(skills, {
            id: skillId
          }, true);
          
          if (matching.length > 0){
            if (! matching[0].hasProficiency){
              delete response.resource.proficiency;
            }
          }
        });

        return response.resource;
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('setSkillNameInterceptor', ['queryCache', 'Skill', 'Session', 'filterFilter',
    function (queryCache, Skill, Session, filterFilter) {
      this.response = function (response) {
        var skillId = response.resource.skillId;
        Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function(skills){
          var matching = filterFilter(skills, {
            id: skillId
          }, true);
          
          if (matching.length > 0){
            response.resource.name = matching[0].name;
          }
        });

        return response.resource;
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantSkillUser', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser'
      });

    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserSkill', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor', 'userSkillCacheRemoveInterceptor', 'setSkillNameInterceptor', 'removeDefaultProficiencyInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, userSkillCacheRemoveInterceptor, setSkillNameInterceptor, removeDefaultProficiencyInterceptor) {

      var TenantUserSkill =  LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:userId/skills/:skillId',
        resourceName: 'TenantUserSkill',
        updateFields: [{
          name: 'proficiency'
        }],
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId',
          skillId: '@id' //POST requires skillId in the request, which causes POST requests to go to /skills/:skillId, unless that param is renamed
        },
        saveInterceptor: [emitInterceptor, setSkillNameInterceptor, removeDefaultProficiencyInterceptor, cacheAddInterceptor],
        updateInterceptor: [emitInterceptor, setSkillNameInterceptor],
        deleteInterceptor: userSkillCacheRemoveInterceptor
      });
      
      TenantUserSkill.prototype.cacheKey = function () {
        return 'TenantUserSkill' + this.userId;
      };

      return TenantUserSkill;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('userSkillCacheRemoveInterceptor', ['queryCache', 'filterFilter',
    function (queryCache, filterFilter) {
      this.response = function (response) {
        if (angular.isDefined(response.resource.cacheKey())){
          var keyName = response.resource.cacheKey();
          
          if(queryCache.get(keyName)) {
            var cacheMatch = filterFilter(queryCache.get(keyName), {
              skillId: response.resource.skillId
            }, true);
            
            if (cacheMatch.length > 0){
              queryCache.get(keyName).removeItem(cacheMatch[0]);
            }
          }
        }

        return response.resource;
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('User', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'userUpdateTransformer',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, userUpdateTransformer) {
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
          name: 'externalId',
          optional: true
        }, {
          name: 'personalTelephone',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor,
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

'use strict';

angular.module('liveopsConfigPanel.user.mock', ['liveopsConfigPanel.mock'])
  .service('mockUsers', function (User) {
    return [new User({
      'id': 'userId1',
      'status': 'disabled',
      'externalId': 73795,
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org'
    }), new User({
      'id': 'userId2',
      'status': 'enabled',
      'externalId': 80232,
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io'
    }), new User({
      'id': 'userId100',
      'status': 'enabled',
      'externalId': 80233,
      'lastName': 'Moon',
      'firstName': 'Jackie',
      'email': 'jackie.moon@liveops.com',
      'displayName': 'Jackie Moon'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockUsers',
    function ($httpBackend, apiHostname, mockUsers) {
      $httpBackend.when('GET', apiHostname + '/v1/users/userId1?tenantId=tenant-id').respond({
        'result': mockUsers[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users/userId2?tenantId=tenant-id').respond({
        'result': mockUsers[1]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/users/userId100?tenantId=tenant-id').respond({
        'result': mockUsers[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users?tenantId=tenant-id').respond({
        'result': mockUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/users').respond({
        'result': [mockUsers[0], mockUsers[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users/userId0?tenantId=tenant-id').respond(404);
      
      $httpBackend.when('POST', apiHostname + '/v1/users').respond(mockUsers[2]);
    }
  ]);