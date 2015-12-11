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
  .value('apiHostname', 'http://localhost:9080')
  .constant('BIRST_URL', 'https://dev-birst.liveopslabs.com')
  .constant('SSO_PASSWORD', 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh')
  .constant('SPACE_ID', '2846b565-23f8-4032-b563-21f8b7a01cc5')
  .constant('helpDocsHostname', 'http://beta-help-docs.liveopslabs.com');

'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.shared.config')

.constant('jsedn', window.jsedn)

.constant('_', window._)

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

;

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

      BulkAction.prototype.reset = function reset () {
        this.checked = false;
      };

      BulkAction.prototype.apply = function apply () {};

      BulkAction.prototype.execute = function execute (items) {
        var promises = [];
        var self = this;
        angular.forEach(items, function (item) {
          if(!self.doesQualify(item)) {
            return;
          }
          promises.push($q.when(self.apply(item)));
        });

        return $q.all(promises);
      };

      BulkAction.prototype.canExecute = function canExecute () {
        return true;
      };

      BulkAction.prototype.doesQualify = function doesQualify () {
        return true;
      };

      return BulkAction;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('bulkActionExecutorController', ['$scope', '$filter', '$q',
    function ($scope, $filter, $q) {
      var self = this;
      $scope.bulkActions = [];

      this.register = function register(bulkAction) {
        $scope.bulkActions.push(bulkAction);
      };

      this.deregister = function register(bulkAction) {
        $scope.bulkActions.removeItem(bulkAction);
      };
      
      this.getCheckedItems = function (items) {
        return $filter('filter')(items, {
          checked: true
        });
      };
      
      this.getAffected = function getAffected() {
        var checkedItems = self.getCheckedItems($scope.items);
        var checkedBulkActions = self.getCheckedItems($scope.bulkActions);
        
        var affectedItems = [];
        
        angular.forEach(checkedItems, function(item) {
          angular.forEach(checkedBulkActions, function(bulkAction) {
            if(bulkAction.doesQualify(item)) {
              affectedItems.push(item);
            }
          });
          
        });
        
        return affectedItems;
      };
      
      this.execute = function execute() {
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        var itemPromises = [];
        
        angular.forEach(selectedBulkActions, function (bulkAction) {
          if (bulkAction.canExecute()) {
            var selectedItems = self.getCheckedItems($scope.items);
            itemPromises.push($q.when(bulkAction.execute(selectedItems)));
          }
        });

        return  $q.all(itemPromises);
      };
      
      this.canExecute = function canExecute () {
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        
        var canExecute = !!selectedBulkActions.length;
        
        if(canExecute = canExecute && !!self.getAffected().length){
          angular.forEach(selectedBulkActions, function (bulkAction) {
            canExecute = canExecute && bulkAction.canExecute();
          });
        }
        
        return canExecute;
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('bulkActionExecutor', ['$q', 'Alert', 'Modal', '$translate', 'DirtyForms', '$filter',
    function ($q, Alert, Modal, $translate, DirtyForms, $filter) {
      return {
        restrict: 'E',
        scope: {
          items: '=',
          showBulkActions: '=',
          dropOrderBy: '@',
          confirmMessageKey: '@'
        },
        transclude: true,
        templateUrl: 'liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        controller: 'bulkActionExecutorController',
        link: function ($scope, elem, attrs, controller, transclude) {

          $scope.confirmExecute = function () {
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant($scope.confirmMessageKey, {
                numItems: controller.getAffected().length
              }),
              okCallback: $scope.execute
            });
          };

          $scope.closeBulk = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.$emit('details:panel:close');
            });
          };

          $scope.selectedItems = function () {
            $scope.checkedItems.clear();
            angular.forEach($scope.items, function (item) {
              if (item.checked) {
                $scope.checkedItems.push(item);
              }
            });

            if ($scope.dropOrderBy) {
              //Reorder elements while preserving original object reference to avoid infinite digest loop
              var sorted = $filter('orderBy')($scope.checkedItems, $scope.dropOrderBy);
              $scope.checkedItems.clear();
              $scope.checkedItems.push.apply($scope.checkedItems, sorted);
            }

            return $scope.checkedItems;
          };

          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              if ($scope.bulkActionForm.$dirty) {
                $scope.resetForm();
              } else {
                $scope.closeBulk();
              }
            });
          };

          $scope.resetForm = function () {
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            angular.forEach(controller.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

          transclude($scope.$parent, function (clone) {
            elem.find('.detail-body').append(clone);
          });

          if (!$scope.confirmMessageKey) {
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }

          $scope.checkedItems = [];

          $scope.$watch('showBulkActions', function (newValue) {
            if (!newValue) {
              $scope.resetForm();
            }
          });

          $scope.execute = function execute() {
            //Prevent unsaved changes warning from triggering if all items are
            //filtered out of the table and the bulk actions panel auto-closes
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();

            return controller.execute().then(function () {
              Alert.success($translate.instant('bulkAction.success'));
              $scope.resetForm();
            });
          };

          $scope.canExecute = controller.canExecute;
        }
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives.bulkAction.mock', ['liveopsConfigPanel.mock'])
  .service('mockBulkActions', ['$q', 'BulkAction', function ($q, BulkAction) {
    var bulkActions = [new BulkAction()];
    bulkActions[0].checked = true;
    spyOn(bulkActions[0], 'execute').and.returnValue($q.when());
    spyOn(bulkActions[0], 'canExecute').and.returnValue(true);

    bulkActions.push(new BulkAction());
    bulkActions[1].checked = true;
    spyOn(bulkActions[1], 'execute').and.returnValue($q.when());
    spyOn(bulkActions[1], 'canExecute').and.returnValue(false);
    
    return bulkActions;
  }]);
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
          //TODO: Consider loReset instead. This one introduces too much coupling.
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
  .directive('loFormSubmit', ['$parse', 'apiErrorKeys',
    function($parse, apiErrorKeys) {
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
                  
                  //if api error is a hardcoded key like "required", then simply
                  //set the form field error key to {value: true}
                  if(apiErrorKeys.indexOf(value) >= 0) {
                    self.formController[key].$setValidity(value, false);
                    self.formController[key].$error = {};
                    self.formController[key].$error[value] = true;
                  } else {
                    self.formController[key].$setValidity('api', false);
                    self.formController[key].$error = {
                      api: value
                    };
                  }
                  
                  
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
  .directive('loReset', ['$q', '$parse', '$timeout', 'DirtyForms', 'modelResetService',
    function ($q, $parse, $timeout, DirtyForms, modelResetService) {
      return {
        restrict: 'A',
        require: ['^form', 'ngModel'],
        controller: function($scope) {
          var vm = this;
          vm.resetForm = function () {
            //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
            //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
            angular.forEach(vm.formController, function (value, key) {
              if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
                var displayValue = value.$modelValue;
                if (displayValue === null) {
                  displayValue = undefined;
                }

                vm.formController[key].$setViewValue(displayValue);
                vm.formController[key].$rollbackViewValue();
              }
            });

            vm.formController.$setPristine();
            vm.formController.$setUntouched();
          };
          
          vm.reset = function reset(model) {
            modelResetService.reset(model);
            vm.resetForm(vm.formController);
          };
          
          vm.onEvent = function (model) {
            model = model ? model : vm.ngModel.$modelValue;
            DirtyForms.confirmIfDirty(function () {
              return $timeout(function(){
                return vm.reset(model)
              });
            });
          };
        },
        
        link: function (scope, elem, attrs, ctrls) {
          var controller = elem.data('$loResetController');
          controller.formController = ctrls[0];
          controller.ngModel = ctrls[1];
          
          if(attrs.name) {
            $parse(attrs.name).assign(scope, controller)
          }
          
          attrs.event = angular.isDefined(attrs.event) ? attrs.event : 'click';
          elem.bind(attrs.event, function () {
            var promise = $q.when(scope.$eval(attrs.loReset));

            promise.then(function (model) {
              controller.onEvent(model);
            });

            scope.$apply();
          });
        }
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmit', ['$q', '$parse', function ($q, $parse) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit', '?^loFormCancel', '?^loFormAlert'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        var loFormAlert = $ctrl[2];

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
            }

            return resource;
          },
          function(error) {
            var def = $q.defer();
            
            if (loFormSubmit){
              loFormSubmit.populateApiErrors(error);
            }
            
            def.reject(error);
            return def.promise;
          });
          
          if (loFormAlert){
            promise = promise.then(function(resource) {
              loFormAlert.alertSuccess(resource);
            }, 
            function(error) {
              loFormAlert.alertFailure(error.config.data);
            });
          }
          
          $scope.$apply();
        });
      }
    };
  }]);

'use strict';

/**
  Taken from a stackoverflow.com post reply

  http://stackoverflow.com/a/25822878
**/

angular.module('liveopsConfigPanel.shared.directives')
  .directive('disableContents', [function() {
    return {
      compile: function(tElem, tAttrs) {
        var inputNames = 'input, button, select, textarea, label';

        var inputs = tElem.find(inputNames);
        angular.forEach(inputs, function(el){
          el = angular.element(el);
          var prevVal = el.attr('ng-disabled');
          prevVal = prevVal ? prevVal +  ' || ': '';
          prevVal += tAttrs.disableContents;
          el.attr('ng-disabled', prevVal);
        });
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('DropdownController', ['$scope', '$document', '$element', function ($scope, $document, $element) {
    var self= this;
    $scope.showDrop = false;
    this.setShowDrop = function(val){ //Used by the dropdownDirective
      $scope.showDrop = val;
    };

    //Only bother listening for the click event when a dropdown is open
    $scope.$watch('showDrop',
      function (newValue, oldValue) {
        $document.off('click', self.onClick);

        if (newValue && !oldValue) {
          $document.on('click', self.onClick);
        }
    });

    this.onClick = function(event) {
      //Hide the dropdown when user clicks outside of it
      var clickedInDropdown = $element.find(event.target).length > 0;
      if (clickedInDropdown) {
        return;
      }

      $scope.$apply(function () {
        $scope.showDrop = false;
        $scope.hovering = false;
      });

      $document.off('click', self.onClick);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@',
        valuePath: '@',
        displayPath: '@',
        collapseIcon: '@',
        expandIcon: '@',
        orderBy: '@',
        hovering: '=?',
        hoverTracker: '=?',
        showOnHover: '='
      },
      templateUrl : 'liveops-config-panel-shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element, attrs, controller) {
        scope.valuePath = scope.valuePath ? scope.valuePath : 'value';
        scope.displayPath = scope.displayPath ? scope.displayPath : 'label';
        
        if (typeof scope.hovering !== 'undefined' && scope.hoverTracker){
          scope.hoverTracker.push(controller);
        }

        scope.clearOtherHovers = function(){
          angular.forEach(scope.hoverTracker, function(hoverCtrl){
            if (hoverCtrl !== controller){
              hoverCtrl.setShowDrop(false);
            }
          });
        };

        if (!scope.orderBy){
          scope.orderBy = 'label';
        }

        scope.optionClick = function(func){
          scope.showDrop = false;
          scope.hovering = false;
          
          if (angular.isFunction(func)){
            func();
          }
        };

        if(! scope.collapseIcon){
          scope.collapseIcon = 'fa fa-caret-up';
        }

        if (! scope.expandIcon){
          scope.expandIcon = 'fa fa-caret-down';
        }

        scope.mouseIn = function(){
          if (scope.hovering || scope.showOnHover){
            scope.showDrop = true;
            scope.clearOtherHovers();
          }
        };

        scope.dropClick = function(){
          scope.showDrop = ! scope.showDrop;
          scope.hovering = ! scope.hovering;
        };
      }
    };
   }])
;

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('filterDropdown', ['$filter', function ($filter) {
    return {
      scope: {
        id: '@',
        options: '=',
        valuePath: '@',
        displayPath: '@',
        label: '@',
        showAll: '@',
        orderBy: '@'
      },
      templateUrl: 'liveops-config-panel-shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope, element) {
        element.parent().css('overflow', 'visible');

        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';
        
        $scope.checkItem = function (option) {
          option.checked = !option.checked;

          $scope.$emit('dropdown:item:checked', option);
        };

        if ($scope.showAll) {

          // If 'all' was checked but some other option has been unchecked, uncheck 'all' option
          // If 'all' was unchecked but all other options are checked, check 'all' option
          $scope.$watch('options', function (newList, oldList) {
            var checkedOptions = $filter('filter')($scope.options, {checked: true}, true);
            
            if ($scope.all.checked && (newList.length > oldList.length)){
              // If a new item was added to the options list, while the 'All' option is selected,
              // we make sure it is checked
              checkAll();
            } else if (checkedOptions.length === $scope.options.length ) {
              $scope.all.checked = true;
            } else {
              $scope.all.checked = false;
            }
          }, true);
          
          $scope.toggleAll = function(){
            $scope.all.checked = !$scope.all.checked;
            
            if ($scope.all.checked) {
              checkAll();
            }
          };
          
          var checkAll = function(){
            angular.forEach($scope.options, function (option) {
              option.checked = true;
            });
          };
          
          var checkAllByDefault = true;
          angular.forEach($scope.options, function (option) {
            checkAllByDefault = checkAllByDefault && (typeof option.checked === 'undefined' ? true : option.checked);
          });
          $scope.all = {
            checked: checkAllByDefault
          };
          if (checkAllByDefault){
            checkAll();
          }
          
        } else {
          $scope.$watch('options', function () {
            angular.forEach($scope.options, function (option) {
              option.checked = (typeof option.checked === 'undefined' ? true : option.checked);
            });
          });
        }
      }
    };
  }]);

angular.module("liveopsConfigPanel.shared.directives").run(["$templateCache", function($templateCache) {$templateCache.put("liveops-config-panel-shared/filters/new.html","");
$templateCache.put("liveops-config-panel-shared/directives/autocomplete/autocomplete.html","<div class=\"autocomplete-container\">\n  <input\n    autocomplete=\"off\"\n    name=\"{{nameField}}\"\n    ng-required=\"isRequired\"\n    type=\"text\"\n    ng-model=\"currentText\"\n    ng-focus=\"showSuggestions=true\"\n    ng-blur=\"onBlur()\"\n    placeholder=\"{{placeholder}}\"\n    ng-keypress=\"($event.which === 13) ? onEnter() : 0\"></input>\n    <i class=\"fa fa-search\"></i>\n    <ul ng-class=\"{\'embeded\' : !hover}\" ng-show=\"filtered.length > 0 && (showSuggestions || hovering)\" ng-mouseover=\"hovering=true\" ng-mouseout=\"hovering=false\">\n      <li ng-class=\"{\'highlight\' : selectedItem == item}\" ng-click=\"select(item)\" ng-repeat=\"item in filtered = (items | filter:filterCriteria | orderBy:nameField)\">{{item[nameField] || item.getDisplay()}}</li>\n    </ul>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html","<form id=\"bulk-action-form\" name=\"bulkActionForm\" class=\"details-pane\" unsaved-changes-warning>\n  <i id=\"close-bulk-button\" class=\"fa fa-remove remove\" ng-click=\"closeBulk()\"></i>\n  <div id=\"bulk-actions-selected-header\" class=\"detail-header\">\n    <filter-dropdown\n      label=\"{{\'bulkActions.selected\' | translate}}({{selectedItems().length}})\"\n      options=\"selectedItems()\"\n      display-path=\"getDisplay\"\n      value-path=\"id\">\n    </filter-dropdown>\n  </div>\n\n  <div class=\"detail-body\">\n    <!-- bulkAction elements injected here -->\n  </div>\n\n  <div class=\"detail-controls\">\n    <input id=\"cancel-bulk-actions-btn\"\n      type=\"button\"\n      class=\"btn\"\n      ng-click=\"cancel()\"\n      value=\"{{\'value.cancel\' | translate}}\">\n    </input>\n    <input id=\"submit-bulk-actions-btn\"\n      ng-disabled=\"!canExecute()\"\n      type=\"button\"\n      class=\"btn btn-primary\"\n      ng-click=\"confirmExecute()\"\n      value=\"{{\'value.submit\' | translate}}\">\n  </div>\n</form>\n");
$templateCache.put("liveops-config-panel-shared/directives/dropdown/dropdown.html","<div class=\"dropdown-wrapper\">\n  <div class=\"drop-label\" ng-class=\"{\'drop-origin\' : showDrop}\" ng-click=\"dropClick()\" ng-mouseenter=\"mouseIn()\">\n    <div>\n      <span>{{label}}</span>\n      <i id=\"nav-dropdown-down-arrow\" ng-show=\"showDrop\" class=\"{{collapseIcon}} label-icon\"></i>\n      <i ng-show=\"! showDrop\" class=\"{{expandIcon}} label-icon\"></i>\n    </div>\n  </div>\n\n  <div class=\"dropdown-container\">\n    <div class=\"dropdown\" ng-hide=\"! showDrop\">\n      <ul>\n        <li id=\"{{item.id}}\"\n          ng-repeat=\"item in items | orderBy:orderBy\"\n          ng-click=\"optionClick(item.onClick)\">\n            <span ng-if=\"! item.stateLink\"><i class=\"{{item.iconClass}}\"></i>{{item[displayPath]}}</span>\n            <a ng-if=\"item.stateLink\" ui-sref=\"{{item.stateLink}}({{item.stateLinkParams}})\"><i class=\"{{item.iconClass}}\"></i>{{item[displayPath]}}</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/dropdown/filterDropdown.html","<div class=\"dropdown-label\" ng-click=\"showDrop = ! showDrop\">\n  <span>{{label}}</span>\n  <div ng-if=\"showAll\" class=\"all-label\">\n    <span ng-if=\"all.checked\"><span ng-if=\"label\">:</span> All</span>\n    <span ng-if=\"!all.checked\"><span ng-if=\"label\">:</span> (...)</span>\n  </div>\n  <span><i class=\"fa\" ng-class=\"{\'fa-caret-up\' : showDrop, \'fa-caret-down\' : ! showDrop}\"></i></span>\n</div>\n\n<div class=\"dropdown-container\">\n  <div class=\"dropdown filter-dropdown\" ng-hide=\"! showDrop || options.length === 0\">\n    <div class=\"all\" ng-if=\"showAll\" ng-click=\"toggleAll()\">\n      <input type=\"checkbox\" ng-checked=\"all.checked\"/>\n      <label>All</label>\n    </div>\n    <div ng-repeat=\"option in options | orderBy:orderBy\"\n      class=\"dropdown-option\" ng-click=\"checkItem(option)\" >\n      <input name=\"{{option | parse:valuePath | invoke:option}}\" type=\"checkbox\" ng-checked=\"option.checked\"/>\n      <label for=\"{{option | parse:valuePath | invoke:option}}\">\n        {{option | parse:displayPath | invoke:option}}\n      </label>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/formError/formError.html","<div class=\"lo-error\" role=\"alert\" ng-if=\'field.$touched && field.$invalid\' ng-messages=\"field.$error\">\n  <div ng-repeat=\"(error, value) in field.$error\" >\n    <span ng-message=\"{{error}}\" ng-if=\"isString(value)\">{{value}}</span>\n    <span ng-message=\"{{error}}\" ng-if=\"value === true\">{{errorTypes[error]}}</span>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/formFieldValidationMessage/formFieldValidationMessage.html","<div class=\"lo-error\" role=\"alert\"\n  ng-if=\'form[fieldName].$touched && form[fieldName].$invalid\'\n  ng-messages=\"form[fieldName].$error\">\n  <div ng-repeat=\"(error, value) in form[fieldName].$error\" >\n    <span ng-message=\"{{error}}\" ng-if=\"isString(value)\">{{value}}</span>\n    <span ng-message=\"{{error}}\" ng-if=\"value === true\">{{errorTypes[error]}}</span>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/helpIcon/helpIcon.html","<span class=\"fa-stack help-icon\" ng-mouseenter=\"showTooltip()\" ng-mouseleave=\"destroyTooltip()\">\n  <i class=\"fa fa-circle-thin fa-stack-2x\"></i>\n  <i class=\"fa fa-info fa-stack-1x\"></i>\n</span>");
$templateCache.put("liveops-config-panel-shared/directives/loMultibox/loMultibox.html","<div ng-class=\"{\'edit\': showDrop === true}\">\n  <div class=\"label-container\" ng-click=\"labelClick()\" ng-hide=\"showDrop && !display\">\n    <input type=\"text\" name=\"{{name + \'-display\'}}\"\n      placeholder=\"{{\'multibox.add.placeholder\' | translate}}\"\n      readonly=\"true\" border=\"0\"  class=\"label\"\n      ng-required=\"true\"\n      ng-model=\"display\" />\n    <i class=\"fa\" ng-class=\"{\'fa-caret-down\': !showDrop, \'fa-caret-up\':showDrop}\"></i>\n  </div>\n\n  <div class=\"edit-box\" ng-show=\"showDrop\">\n    <type-ahead\n      items=\"items\"\n      placeholder=\"{{\'multibox.search.placeholder\' | translate}}\"\n      on-select=\"onSelect(selectedItem)\"\n      keep-expanded=\"true\"\n      selected-item=\"selectedItem\"></type-ahead>\n    <input id=\"show-create-new-item-btn\" class=\"btn\" type=\"button\"\n      ng-click=\"createItem()\" \n      value=\"{{\'multibox.create.btn\' | translate}}\" />\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/loading/loading.html","<div class=\"loading\"><i class=\"fa fa-refresh fa-spin\"></i> {{\'loading\' | translate}}</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/modal/modal.html","<div id=\"modal\" ng-include=\"modalBody\">\n\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/numberSlider/numberSlider.html","<div class=\"number-slider inner-addon right\">\n  <input type=\"text\" ng-model=\"value\" placeholder=\"{{placeholder}}\"></input>\n  <i ng-mousedown=\"increment()\" class=\"fa fa-caret-up top\" ng-class=\"{disabled : value + 1 > maxValue}\"></i>\n  <i ng-mousedown=\"decrement()\" class=\"fa fa-caret-down bottom\" ng-class=\"{disabled : value - 1 < minValue}\"></i>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/resizeHandle/resizeHandle.html","<div class=\"resizable-handle\"><i class=\"fa fa-ellipsis-v\"></i></div>");
$templateCache.put("liveops-config-panel-shared/directives/singleElementResizeHandle/singleElementResizeHandle.html","<div class=\"resizable-handle\"><i class=\"fa fa-ellipsis-v\"></i></div>");
$templateCache.put("liveops-config-panel-shared/directives/toggle/toggle.html","<label ng-show=\"trueValue && falseValue\" class=\"switch switch-green\" ng-switch on=\"confirmOnToggle\">\n  <input name=\"{{name}}\" ng-switch-when=\"true\" confirm-toggle type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-true-value=\"\'{{trueValue}}\'\" ng-false-value=\"\'{{falseValue}}\'\" ng-disabled=\"ngDisabled\">\n  <input name=\"{{name}}\" ng-switch-default type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-true-value=\"\'{{trueValue}}\'\" ng-false-value=\"\'{{falseValue}}\'\" ng-disabled=\"ngDisabled\">\n  <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n  <span class=\"switch-handle\"></span>\n</label>\n\n<label class=\"switch switch-green\" ng-show=\"!trueValue || !falseValue\" ng-switch on=\"confirmOnToggle\">\n  <input name=\"{{name}}\" ng-switch-when=\"true\" confirm-toggle type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-disabled=\"ngDisabled\">\n  <input name=\"{{name}}\" ng-switch-default type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-disabled=\"ngDisabled\">\n  <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n  <span class=\"switch-handle\"></span>\n</label>");
$templateCache.put("liveops-config-panel-shared/directives/tooltip/tooltip.html","<div class=\"help-tooltip\"><div class=\"tooltip-content\" translate=\"{{translateValue}}\">{{text}}</div><div class=\"tooltip-arrow\"></div></div>");
$templateCache.put("liveops-config-panel-shared/directives/typeAhead/typeAhead.html","<div class=\"typeahead-container\">\n  <input\n    autocomplete=\"off\"\n    placeholder=\"{{placeholder}}\"\n    name=\"{{nameField}}\"\n    id=\"typeahead-container\"\n    type=\"text\"\n    ng-model=\"currentText\"\n    ng-focus=\"showSuggestions=true\"\n    ng-blur=\"onBlur()\"></input>\n    <i class=\"fa fa-search\"></i>\n    <ul ng-show=\"filtered.length > 0 && (showSuggestions || hovering)\" \n      ng-mouseover=\"hovering=true\" \n      ng-mouseout=\"hovering=false\">\n       <li ng-repeat=\"item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)\"\n         ng-class=\"{\'highlight\' : highlightedItem == item}\"  \n         ng-click=\"select(item)\" >\n           {{item.getDisplay() || item[nameField]}}\n       </li>\n    </ul>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/services/modal/confirmModal.html","\n<div class=\"confirm\">\n  <h3 class=\"header\">{{title}}</h3>\n  <p>{{message}}</p>\n  \n  <div class=\"footer\">\n    <a id=\"modal-cancel\" class=\"btn\" ng-click=\"cancelCallback()\">{{\'value.cancel\' | translate}}</a>\n    <a ng-click=\"okCallback()\" class=\"btn btn-primary\" id=\"modal-ok\">{{\'value.ok\' | translate}}</a>\n  </div>\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/editField/dropDown/editField_DropDown.html","<div class=\"edit-field edit-field-drop-down\" ng-init=\"edit = false\">\n  <ng-transclude></ng-transclude>\n  <div class=\"input-toggle\">\n\n    <select ng-model=\"ngModel\" ng-options=\"option for option in [\'Admin\', \'Agent\']\" name={{name}} required=\"\" ng-show=\"edit\" ng-change=\"saveHandler()\">\n      <option value=\"\">{{defaultText}}</option>\n    </select>\n\n    <div ng-mouseover=\"hover=true\" ng-mouseout=\"hover=false\" ng-click=\"edit = true\" title=\"Click to edit.\" ng-show=\"!edit\">\n      <label ng-show=\"ngModel\">{{ngModel}}</label>\n      <label class=\"placeholder\" ng-show=\"!ngModel\">Click to add value</label>\n      <i class=\"fa fa-pencil\" ng-show=\"hover\"></i>\n    </div>\n  </div>\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/editField/input/editField_input.html","<div class=\"edit-field edit-field-input\" ng-init=\"edit = false\">\n  <label>{{label}}</label>\n  <div class=\"input-toggle\">\n    <input ng-model=\"ngModel\" name=\"{{name}}\" type=\"{{type ? type : \'text\'}}\" required=\"\" ng-show=\"edit\" ng-keyup=\"$event.keyCode == 13 ? saveHandler($event) : null\">\n    \n    <div ng-mouseover=\"hover=true\" ng-mouseout=\"hover=false\" ng-click=\"edit = true\" title=\"Click to edit.\" ng-show=\"!edit\">\n      <label ng-show=\"ngModel\">{{ngModel}}</label>\n      <label class=\"placeholder\" ng-show=\"!ngModel\">{{placeholder ? placeholder : \'Click to add value\'}}</label>\n      <i class=\"fa fa-pencil\" ng-show=\"hover\"></i>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/conditionGroup/conditionGroupEditor.html","<div ng-class=\"{\'input-group\': !cqe.readonly}\">\n  <label ng-show=\"!cqe.readonly || cqe.conditionGroup.conditions.length > 0\" ng-class=\"{\'has-elements\': cqe.conditionGroup.conditions.length > 0}\">\n    {{ cqe.sectionLabel }}\n  </label>\n\n  <div class=\"instant-add\" ng-show=\"!cqe.readonly\">\n    <div>\n      <type-ahead hover=\"true\" placeholder=\"{{ cqe.placeholderText }}\"\n        items=\"cqe.items\" selected-item=\"cqe.selectedItem\" filters=\"cqe.conditionsFilter\">\n      </type-ahead>\n\n      <proficiency-selector ng-show=\"cqe.selectedItem.hasProficiency\" operator=\"cqe.conditionOperator\" proficiency=\"cqe.conditionProficiency\"></proficiency-selector>\n    </div>\n\n    <button class=\"add btn\" type=\"button\"\n      ng-disabled=\"!cqe.selectedItem.id\" ng-click=\"cqe.addSelectedCondition()\">\n      <i class=\"fa fa-plus\"></i>\n    </button>\n  </div>\n\n  <div class=\"tag-wrapper clear\">\n    <div class=\"tag\" ng-repeat=\"condition in cqe.conditionGroup.conditions\">\n      {{cqe.getConditionName(condition) + \' \' + cqe.prettyConditionFilter(condition)}}\n      <a ng-show=\"!cqe.readonly\" ng-click=\"cqe.conditionGroup.removeCondition(condition)\"><i class=\"fa fa-times\"></i></a>\n    </div> \n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalation/escalationEditor.html","<ng-form name=\"ec.forms.timeAfterForm\">\n  <div class=\"input-group time-input\" ng-if=\"ec.minSecondsRequired > 0\">\n    <label>{{\'queues.query.builder.after.seconds\' | translate}}</label>\n    <input ng-required=\"true\" name=\"amount\" type=\"number\" ng-model=\"ec.timeAmount\" ng-change=\"ec.updateTimeInSeconds()\" />\n    <select ng-model=\"ec.afterSecondsMultiplier\" ng-options=\"option.value as option.label for option in ec.afterTimeOptions\" ng-change=\"ec.updateMultiplier()\">\n    </select>\n    <form-error field=\"ec.forms.timeAfterForm.amount\"\n      error-type-required=\"Time in queue is required\"\n      error-type-min-time=\"Time in queue must be greater then the previous value\">\n    </form-error>\n  </div>\n</ng-form>\n\n<escalation-query-editor escalation-query=\"ec.escalation.query\"></escalation-query-editor>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalationList/escalationListEditor.html","<div class=\"divider-header first-header\">\n  <h4>{{\'value.details.query\' | translate}}</h4>\n  <a class=\"pull-right\">\n    <span id=\"show-advanced-query\" ng-show=\"!qlc.isAdvancedMode\" ng-click=\"qlc.advancedMode()\">\n      {{\'queue.details.version.query.advanced.link\' | translate}}\n    </span>\n    <span class=\"pull-right\"  id=\"show-basic-query\" ng-show=\"qlc.isAdvancedMode && qlc.initialAdvancedQuery\" ng-click=\"qlc.basicMode()\">\n      {{\'queue.details.version.query.basic.link\' | translate}}\n    </span>\n  </a>\n</div>\n\n\n<ng-form name=\"qlc.forms.advancedQueryForm\">\n  <div class=\"input-group\" ng-if=\"qlc.isAdvancedMode\">\n    <label class=\"textarea-label\">{{\'value.details.query\' | translate}}</label>\n    <textarea zermelo-escalation-list-validator id=\"advanced-query-field\"\n      ng-required=\"true\" type=\"text\" ng-model=\"qlc.advancedQuery\" name=\"query\"\n     ng-change=\"qlc.advancedQueryChanged()\"></textarea>\n     <form-error field=\"qlc.forms.advancedQueryForm.query\"\n       error-type-required=\"{{\'queue.details.queue.error\' | translate}}\"\n       error-type-zermelo=\"{{\'queue.query.build.zermelo.invalid\' | translate}}\">\n     </form-error>\n  </div>\n</ng-form>\n\n\n\n<div ng-if=\"!qlc.isAdvancedMode\" class=\"query-component\" ng-repeat=\"escalation in qlc.escalationList.escalations\">\n  <div ng-class=\"{\'detail-group\': $index !== 0 }\">\n    <div class=\"divider-header\" ng-if=\"$index !== 0\">\n      <h4>{{ \'queue.query.escalation.level\' | translate:{level: $index} }}</h4>\n      <a class=\"pull-right\" ng-click=\"qlc.removeEscalation(escalation)\">{{ \'queue.query.escalation.level.remove\'| translate}}</a>\n    </div>\n\n    <escalation-editor\n      escalation=\"escalation\"\n      min-seconds=\"qlc.minSecondsForQuery($index)\"\n      previous-escalation=\"::qlc.escalationList.escalations[$index-1]\">\n    </escalation-editor>\n\n    <div >\n      <div class=\"divider-header\" ng-if=\"$index === 0\">\n        <h4>{{ \'queue.query.escalation\' | translate}}</h4>\n      </div>\n\n      <div ng-if=\"!qlc.escalationList.escalations[$index + 1]\" class=\"add-query detail-group\">\n        <h4>{{ \'queue.query.add.escalation.level\' | translate:{level: ($index+1)} }}</h4>\n        <div class=\"add-group-button\">\n          <button class=\"add btn\" type=\"button\" ng-click=\"qlc.addEscalation()\">\n            <i id=\"add-filter-btn\" class=\"fa fa-plus\"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalationQuery/escalationQueryEditor.html","\n<div class=\"input-group\" id=\"add-query-filter\">\n  <label>{{\'queues.query.builder.filters.label\' | translate}}</label>\n  <div class=\"instant-add add-filter\" disable-contents=\"eqc.possibleGroups.length == 0\">\n    <select id=\"select-filter-dropdown\"\n      ng-model=\"eqc.currentGroup\">\n      <option value=\"\" disabled>{{\'queues.query.builder.filters.placeholder\' | translate}}</option>\n      <option ng-repeat=\"key in eqc.possibleGroups\" value=\"{{key}}\">{{\'queues.query.builder.\' + key | translate }}</option>\n    </select>\n    <div class=\"add-group-button\">\n      <button class=\"add btn\" type=\"button\"\n        ng-disabled=\"!eqc.currentGroup\"\n        ng-click=\"eqc.addGroup(eqc.currentGroup)\">\n\n        <i id=\"add-filter-btn\" class=\"fa fa-plus\"></i>\n      </button>\n    </div>\n  </div>\n</div>\n\n\n<div ng-repeat=\"item in eqc.escalationQuery.groups\" class=\"details-group\">\n\n  <div class=\"query-component\">\n    <div class=\"divider-header\">\n      <h4>{{ \'queues.query.builder.\' + item.key + \'.title\' | translate }}</h4>\n      <a class=\"pull-right\" ng-click=\"eqc.verifyRemoveGroup(item.key)\">\n        {{\'queue.query.filter.remove\' | translate}}\n      </a>\n    </div>\n    <object-group-editor\n      object-group=\"item.objectGroup\"\n      key=\"item.key\">\n    </object-group-editor>\n  </div>\n\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/objectGroup/objectGroupEditor.html","<condition-group-editor\n  class=\"details-group\"\n  condition-group=\"oge.objectGroup.andConditions\"\n  items=\"oge.items\"\n  section-label=\"{{\'queue.query.builder.\' + oge.key + \'.all\' | translate}}\"\n  placeholder-text=\"{{ oge.placeholderText }}\"\n  readonly=\"oge.readonly\">\n</condition-group-editor>\n\n<condition-group-editor\n  class=\"details-group\"\n  condition-group=\"oge.objectGroup.orConditions\"\n  items=\"oge.items\"\n  section-label=\"{{\'queue.query.builder.\' + oge.key + \'.some\' | translate}}\"\n  placeholder-text=\"{{ oge.placeholderText }}\"\n  readonly=\"oge.readonly\">\n</condition-group-editor>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/proficiency/proficiencySelector.html","<div>\n  <select ng-model=\"operator\" class=\"pull-left proficiency-operator-dropdown\">\n    <option value=\">=\">{{ \'queue.query.builder.at.least\' | translate }}</option>\n    <option value=\"<=\">{{ \'queue.query.builder.at.most\' | translate }}</option>\n    <option value=\"=\">{{ \'queue.query.builder.exactly\' | translate }}</option>\n  </select>\n  <number-slider value=\"proficiency\"\n    min-value=\"1\" max-value=\"100\" class=\"proficiency-value pull-left\">\n  </number-slider>\n</div>\n");}]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')

  .controller('EditFieldController', function ($scope) {

    $scope.saveHandler = function($event) {
      if ($event){
        $event.target.blur();
      }
      
      $scope.$emit('editField:save', {
        objectId: $scope.objectId,
        fieldName: $scope.name,
        fieldValue: $scope.ngModel
      });
    };

    $scope.$on($scope.name + ':save', function() {
      $scope.edit = false;
    });

  });


'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('formError', function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/formError/formError.html',
      scope : {
        field : '='
      },
      link : function($scope, $elem, $attrs){
        $scope.errorTypes = {};
        angular.forEach($attrs.$attr, function(value, key){
          if(key.match(/errorType+/)){
            var errorName = key.replace(/errorType/, '');
            var firstChar = errorName.charAt(0);
            errorName = errorName.replace(/^\w/, firstChar.toLowerCase());
            $scope.errorTypes[errorName] = $attrs[key];
            
            $attrs.$observe(key, function(attrValue){
              $scope.errorTypes[errorName] = attrValue;
            });
          }
        });
        
        $scope.isString = function(value) {
          return angular.isString(value);
        };
      }
    };
   });

'use strict';

/*
  formFieldValidationMessage is basically a clone of formError with a couple o
  key differences:
    - it "requires" a form up the DOM tree
    - it resolves the field based fieldName
*/
angular.module('liveopsConfigPanel.shared.directives')
  .directive('formFieldValidationMessage', function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/formFieldValidationMessage/formFieldValidationMessage.html',
      require: '^form',
      scope : {
        fieldName : '@'
      },
      link : function($scope, $elem, $attrs, form){
        $scope.form = form;
        
        $scope.errorTypes = {};
        angular.forEach($attrs.$attr, function(value, key){
          if(key.match(/errorType+/)){
            var errorName = key.replace(/errorType/, '');
            var firstChar = errorName.charAt(0);
            errorName = errorName.replace(/^\w/, firstChar.toLowerCase());
            
            $attrs.$observe(key, function(attrValue){
              $scope.errorTypes[errorName] = attrValue;
            });
          }
        });
        
        $scope.isString = function(value) {
          return angular.isString(value);
        };
      }
    };
   });

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/helpIcon/helpIcon.html',
      scope : {
        text : '@',
        translateValue: '@'
      },
      link: function($scope, element){
        $scope.target = element;
        var tooltipElement;

        $scope.showTooltip = function(){
          tooltipElement = $compile('<tooltip target="target" text="{{text}}" translate-value="{{translateValue}}"></tooltip>')($scope);
          $document.find('body').append(tooltipElement);
        };

        $scope.destroyTooltip = function(){
          tooltipElement.remove();
        };
      }
    };
   }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('highlightOnClick', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      element.on('click', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length);
        }
      });
    }
  };
}]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loMultibox', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      scope: {
        items: '=',
        selectedItem: '=',
        resourceName: '@',
        name: '@',
        onItemSelect: '='
      },
      templateUrl: 'liveops-config-panel-shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {
        
        $scope.onSelect = function(selectedItem){
          if (angular.isString(selectedItem)){
            return;
          }
          
          $scope.display = selectedItem.getDisplay();
          
          if(angular.isFunction($scope.onItemSelect)) {
            $scope.onItemSelect(selectedItem);
          }

          dropCtrl.setShowDrop(false);
          $scope.createMode = false;
        };

        $scope.createItem = function(){
          $scope.$emit('resource:details:create:' + $scope.resourceName, $scope.selectedItem);
          $scope.createMode = true;
        };

        $scope.labelClick = function(){
          dropCtrl.setShowDrop(!$scope.showDrop);
          
          $scope.selectedItem = null;

          if ($scope.showDrop){
            $timeout(function(){
              var input = ele.find('type-ahead input');
              input.focus();
            });
          }
        };

        $scope.$watch('selectedItem', function(item) {
          if (angular.isString(item)){
            return;
          } else if(item && angular.isFunction(item.getDisplay)) {
            $scope.display = item.getDisplay();
          }
        }, true);

        $scope.$on('resource:details:' + $scope.resourceName + ':canceled', function () {
          $scope.createMode = false;
        });

        $scope.$on('created:resource:' + $scope.resourceName,
          function (event, resource) {
            if ($scope.createMode){
              $scope.onSelect(resource);
            }
        });
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmitSpinner', [function() {
    return {
      scope : {
        loSubmitSpinnerStatus: '&'
      },
      link: function($scope, ele) {
        $scope.spinnerElement = angular.element('<a disabled="true"><i class="fa fa-refresh fa-spin"></i></a>');
        $scope.spinnerElement.addClass(ele[0].className);
        $scope.spinnerElement.addClass('ng-hide');
        ele.after($scope.spinnerElement);

        $scope.$watch('loSubmitSpinnerStatus()', function (val) {
          if (angular.isDefined(val)) {
            ele.toggleClass('ng-hide', val);
            $scope.spinnerElement.toggleClass('ng-hide', !val);
          }
        });
      }
    };
   }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loValidate', [function() {
    return {
      require: 'ngModel',
      link: function($scope, element, attrs, controller) {
        
        controller.$disabledValidators = {};
        controller.$disabledFormatters = {};
        
        $scope.$watch(attrs.loValidate, function(newValidate) {
          if (newValidate){
            enable();
          } else {
            disable();
          }
        }, true);
        
        function disable() {
          angular.extend(controller.$disabledValidators, controller.$validators);
          controller.$validators = {};
          
          angular.extend(controller.$disabledFormatters, controller.$formatters);
          controller.$formatters = {};
          
          for(var validator in controller.$disabledValidators) {
            controller.$setValidity(validator, true);
          }
        }
        
        function enable() {
          angular.extend(controller.$validators, controller.$disabledValidators);
          controller.$disabledValidators = {};
          
          angular.extend(controller.$formatters, controller.$disabledFormatters);
          controller.$disabledFormatters = {};
        }
      }
    };
   }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loading', [function() {
    return {
      restrict : 'E',
      templateUrl : 'liveops-config-panel-shared/directives/loading/loading.html'
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('modal', [function () {
  return {
    restrict: 'E',
    templateUrl : 'liveops-config-panel-shared/directives/modal/modal.html'
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

angular.module('liveopsConfigPanel.shared.directives')
  .directive('numberSlider', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      scope: {
        value: '=',
        minValue: '@',
        maxValue: '@',
        hasHandles: '=',
        placeholder: '@',
        ngChanged: '&'
      },
      templateUrl: 'liveops-config-panel-shared/directives/numberSlider/numberSlider.html',
      link: function($scope, element) {

        $scope.minValue = $scope.minValue ? Number($scope.minValue) : null;
        $scope.maxValue = $scope.maxValue ? Number($scope.maxValue) : null;

        $scope.$watch('value', function () {
          if($scope.value){
            if(typeof($scope.value) === 'string'){
              $scope.value = Number($scope.value.replace(/[^0-9\\.\\-]/g, ''));
            }

            if ($scope.maxValue !== null && $scope.value > $scope.maxValue) {
              $scope.value = $scope.maxValue;
            }

            if ($scope.minValue !== null && $scope.value < $scope.minValue) {
              $scope.value = $scope.minValue;
            }

            $scope.ngChanged($scope.value);
          }
        });

        $scope.increment = function () {
          if(! $scope.value){
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.ngChanged();
            return;
          }

          if($scope.maxValue === null || $scope.value < $scope.maxValue){
            $scope.value = Number($scope.value) + 1;
            $scope.ngChanged();
          }
        };

        $scope.decrement = function () {
          if(!$scope.value){
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.ngChanged();
            return;
          }

          if($scope.minValue === null || $scope.value > $scope.minValue){
            $scope.value = Number($scope.value) - 1;
            $scope.ngChanged();
          }
        };

        element.find('input').bind('keydown keypress', function(event){
          if(event.which === 40){ //Down arrow key
            $timeout($scope.decrement);
            event.preventDefault();
          } else if(event.which === 38){ //Up arrow key
            $timeout($scope.increment);
            event.preventDefault();
          }
        });
      }
    };
  }]);

'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel.shared.directives')
  .directive('resizeHandle', ['$window', '$document', '$rootScope', 'lodash',
    function($window, $document, $rootScope, _) {
    return {
      restrict : 'E',
      scope : {
        leftElementId : '@',
        rightElementId : '@'
      },

      templateUrl : 'liveops-config-panel-shared/directives/resizeHandle/resizeHandle.html',
      link : function(scope, element) {
        element.addClass('resize-pane');

        scope.leftTargetElement = angular.element($('#'+scope.leftElementId));
        scope.rightTargetElement = angular.element($('#'+scope.rightElementId));

        element.on('mousedown', function(event) {
          //Don't initiate resize on right click, because it's annoying
          if (event.button !== 2) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', scope.mouseup);
          }
        });

        function mousemove(event) {
          var leftWidth = scope.leftTargetElement[0].offsetWidth;
          var rightWidth = scope.rightTargetElement[0].offsetWidth;

          var leftBox = scope.leftTargetElement[0].getBoundingClientRect();
          var leftLeft = leftBox.left;

          var x = event.pageX;
          x = x - leftLeft; //Correct for any offset that the panel container(s) have on the screen

          scope.resizeElements(leftWidth, rightWidth, x);
        }

        scope.resizeElements = function(currLeftWidth, currRightWidth, mouseX){
          var delta = currLeftWidth - mouseX,
              newLeftWidth = currLeftWidth - delta,
              newRightWidth = currRightWidth + delta,
              leftMinWidth = parseInt(scope.leftTargetElement.css('min-width')),
              rightMinWidth = parseInt(scope.rightTargetElement.css('min-width'));

          if(newRightWidth < rightMinWidth || newLeftWidth < leftMinWidth){
            return;
          }

          scope.leftTargetElement.css('width', newLeftWidth + 'px');
          scope.rightTargetElement.css('width', newRightWidth + 'px');

          var eventInfo = {
            leftWidth: newLeftWidth,
            rightWidth: newRightWidth
          };

          scope.sendResizeEvent(eventInfo);
          scope.applyClasses(eventInfo, scope.leftTargetElement, 'leftWidth');
          scope.applyClasses(eventInfo, scope.rightTargetElement, 'rightWidth');
        };

        scope.sendResizeEvent = _.throttle(function(eventInfo){
          $rootScope.$broadcast('resizehandle:resize', eventInfo);
        }, 500);

        scope.applyClasses = function(info, element, fieldName){
          if (info[fieldName] > 700){
            element.addClass('two-col');
          } else {
            element.removeClass('two-col');
          }

          if (info[fieldName] < 450){
            element.addClass('compact-view');
          } else {
            element.removeClass('compact-view');
          }
        };

        scope.mouseup = function() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', scope.mouseup);
        };
      }
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('scrollTable', [function() {
    return {
      restrict: 'A',
      replace: 'true',
      compile: function CompilingFunction($templateElement) {
        $templateElement.removeAttr('scroll-table'); //Prevent infinite recursion

        var headerHeight = $templateElement.find('thead').height();
        if (headerHeight === 0){
          headerHeight = 35;
        }

        var headerCopy = $templateElement.find('thead').clone(true, true);
        headerCopy.find('th').css('height', headerHeight + 'px');

        var cloneHeaderTable = angular.element('<table class="clone-header">' + headerCopy[0].outerHTML + '</table>');
        var origClasses = $templateElement[0].className;
        cloneHeaderTable.addClass(origClasses);

        //Remove duplicated header inputs for cleaner HTML
        //Note: if a cell contains only an input and has no width explicitly set,
        //removing the input will cause misalignment between the table cells and the header cells.
        $templateElement.find('thead').find('input').remove();

        $templateElement.replaceWith('<div class="scrollable-table-container" style="padding-top:' + headerHeight + 'px;">' +
            cloneHeaderTable[0].outerHTML +
            '<div class="table-wrapper"><div>' + $templateElement[0].outerHTML + '</div></div>' +
            '</div>');

        return function($scope, element, attrs){
          if (attrs.maxHeight){
            $scope.$watch(function(){return element.find('tbody').find('tr').length;}, function(count){
              if (count > 0){
                var approxHeight = headerHeight * count;
                if (approxHeight < attrs.maxHeight){
                  element.css('height', approxHeight + headerHeight + 5 + 'px');
                } else {
                  element.css('height', attrs.maxHeight + 'px');
                }
              }
            });
          }
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('separateValidation', [function () {
    return {
      restrict: 'A',
      require: '?form',
      link: function link($scope, element, iAttrs, formController) {

        if (! formController) {
          return;
        }

        // Remove this form from parent controller
        var parentFormController = element.parent().controller('form');

        if(parentFormController){
          parentFormController.$removeControl(formController);
        }
        
        // Replace form controller with a "null-controller"
        var nullFormCtrl = {

          $setValidity: function () {
            formController.$invalid = false;
            angular.forEach(element.find('input'), function (ele){
              if(formController[ele.name] && formController[ele.name].$error) {
                for (var prop in formController[ele.name].$error){
                  if(prop && formController[ele.name].$error[prop]) {
                    formController.$invalid = true;
                    break;
                  }
                }
              }

            });

          },
          $setDirty: function () {
            formController.$dirty = true;
          },
          $setPristine: function (value) {
            formController.$pristine = value;
          }
        };

        angular.extend(formController, nullFormCtrl);
      }
    };
  }]);

'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel.shared.directives')
  .directive('singleElementResizeHandle', ['$window', '$document', '$rootScope', 'lodash', function($window, $document, $rootScope, _) {
    return {
      restrict : 'E',
      scope : {
        elementId : '@',
        minWidth: '@',
        maxWidth: '@'
      },
      templateUrl : 'liveops-config-panel-shared/directives/singleElementResizeHandle/singleElementResizeHandle.html',
      link : function($scope, $element) {
        $scope.targetElement = angular.element(document.getElementById($scope.elementId));

        $element.on('mousedown', function(event) {
          if (event.button !== 2) {
            event.preventDefault();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', $scope.mouseup);
          }
        });

        function mousemove(event) {
          var elementWidth = $scope.targetElement[0].offsetWidth;
          var pageX = event.pageX;
          var windowWidth = $window.innerWidth;

          $scope.resizeElement(elementWidth, windowWidth, pageX);
        }

        $scope.applyClasses = function(width, element){
          if (width > 700){
            element.addClass('two-col');
          } else {
            element.removeClass('two-col');
          }

          if (width < 450){
            element.addClass('compact-view');
          } else {
            element.removeClass('compact-view');
          }
        };

        $scope.mouseup = function() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', $scope.mouseup);
        };

        $scope.sendResizeEvent = _.throttle(function(eventInfo) {
          $rootScope.$broadcast('resizehandle:resize', eventInfo);
        }, 500);

        $scope.resizeElement = function(elementWidth, windowWidth, pageX) {
          var newElementWidth = windowWidth - pageX;

          if (newElementWidth < $scope.minWidth || newElementWidth > $scope.maxWidth) {
            return;
          }

          $scope.targetElement.css('width', newElementWidth + 'px');
          $scope.sendResizeEvent(newElementWidth);
          $scope.applyClasses(newElementWidth, $scope.targetElement);
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('dateToMinuteConverterController', [function() {
    this.format = function (value) {
      if(value === -1) {
        return null;
      } else if(angular.isNumber(value)) {
        return new Date(0,0,0,0,value,0,0);
      }

      return value;
    };
    
    this.parse = function(value) {
      if(value === null) {
        return -1;
      } else if(!(value instanceof Date)) {
        return value;
      }

      return (value.getHours() * 60) + value.getMinutes();
    };
  }])
  .directive('dateToMinuteConverter', [function () {
    return {
      require: 'ngModel',
      controller: 'dateToMinuteConverterController',
      link: function ($scope, elem, attr, ngModel) {
        var controller = elem.data('$dateToMinuteConverterController');
        ngModel.$formatters.push(controller.format);
        ngModel.$parsers.push(controller.parse);
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('confirmToggle', ['Modal', function(Modal) {
    return {
      require: ['ngModel', '^toggle'],
      link: function ($scope, $element, $attrs, controllers) {
        controllers[0].$parsers.push(function (newValue) {
          return $scope.onToggle(newValue);
        });

        $scope.onToggle = function(newValue){
          $scope.$evalAsync(function(){ //For display until confirm dialog value is resolved
            $scope.$parent.ngModel = (newValue === $scope.trueValue ? $scope.falseValue : $scope.trueValue);
          });

          return Modal.showConfirm({
            message: (newValue === $scope.trueValue ? $scope.confirmEnableMessage : $scope.confirmDisableMessage)
          }).then(function(){
            $scope.$parent.ngModel = newValue;
          });
        };
      }
    };
   }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('toggle', [function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '=',
        name: '@',
        trueValue: '@',
        falseValue: '@',
        confirmEnableMessage: '@',
        confirmDisableMessage: '@'
      },
      controller: function ($scope) {
        if (angular.isUndefined($scope.trueValue)){
          $scope.trueValue = true;
        }

        if(angular.isUndefined($scope.falseValue)) {
          $scope.falseValue = false;
        }

        if (angular.isDefined($scope.confirmEnableMessage) && angular.isDefined($scope.confirmDisableMessage)){
          $scope.confirmOnToggle = true;
        }
      }
    };
   }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('tooltip', ['$document', '$timeout', function ($document, $timeout) {
    return {
      templateUrl: 'liveops-config-panel-shared/directives/tooltip/tooltip.html',
      scope: {
        text: '@',
        target: '=',
        translateValue: '@'
      },
      link: function ($scope, element) {
        $scope.targetPosition = $scope.target.offset();
        $scope.tooltipWidth = 0;
        $scope.tooltipHeight = 0;

        $scope.setPosition = function () {
          element.find('div').removeClass('top left right bottom');
          $scope.tooltipWidth = element.outerWidth();
          $scope.tooltipHeight = element.outerHeight();

          var tooltipPos = $scope.getPositionClass();
          var absolutePosition = $scope.getAbsolutePosition(tooltipPos);

          element.find('div').addClass(tooltipPos);

          element.css('left', absolutePosition.left);
          element.css('top', absolutePosition.top);
        };

        $scope.getPositionClass = function () {
          var tooltipPos;

          var documentWidth = $document.width();
          var documentHeight = $document.height();

          var top = $scope.targetPosition.top;
          var left = $scope.targetPosition.left;

          if (top - $scope.tooltipHeight < 0) {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'bottom right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'bottom left';
            } else {
              tooltipPos = 'bottom center';
            }
          } else if (top + $scope.tooltipHeight > documentHeight) {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'top right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'top left';
            } else {
              tooltipPos = 'top center';
            }
          } else {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'center right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'center left';
            } else {
              tooltipPos = 'top center';
            }
          }

          return tooltipPos;
        };

        $scope.getAbsolutePosition = function (tooltipPos) {
          var arrowHeight = 15;
          var arrowWidth = 13;
          var arrowBase = 25;

          var targetHeight = $scope.target.outerHeight();
          var targetWidth = $scope.target.outerWidth();

          var offsetLeft = $scope.targetPosition.left;
          var offsetTop = $scope.targetPosition.top;

          if (tooltipPos.indexOf('left') > -1) {
            offsetLeft += -$scope.tooltipWidth - arrowWidth;
          }

          if (tooltipPos.indexOf('right') > -1) {
            offsetLeft += targetWidth + arrowWidth;
          }

          if (tooltipPos === 'bottom center') {
            offsetTop += targetHeight + arrowHeight;
            offsetLeft += -(($scope.tooltipWidth - targetWidth) / 2);
          } else if (tooltipPos === 'top center') {
            offsetTop += -($scope.tooltipHeight + arrowHeight);
            offsetLeft += -(($scope.tooltipWidth - targetWidth) / 2);
          } else if (tooltipPos === 'top right' || tooltipPos === 'top left') {
            offsetTop += -$scope.tooltipHeight + arrowBase;
          } else if (tooltipPos === 'center right' || tooltipPos === 'center left') {
            offsetTop += -($scope.tooltipHeight / 2) + (targetHeight / 2);
          }

          return {
            top: offsetTop,
            left: offsetLeft
          };
        };

        $timeout($scope.setPosition, 1);
      }
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('typeAhead', ['$filter', '$timeout', function($filter, $timeout) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        nameField: '@',
        onSelect: '&',
        placeholder: '@',
        prefill: '=',
        keepExpanded: '=',
        onEnter: '&',
        filters: '=?',
        selectedItem: '=?'
      },

      templateUrl: 'liveops-config-panel-shared/directives/typeAhead/typeAhead.html',

      controller: function($scope) {
        var self = this;

        $scope.currentText = $scope.prefill || '';

        this.defaultTextFilter = function defaultTextFilter(item, text) {
          return item.getDisplay().toLowerCase().contains(text.toLowerCase());
        };

        $scope.filterCriteria = function(item) {
          if (!$scope.filterArray) {
            return;
          }

          var include = true;
          for (var filterIndex = 0; filterIndex < $scope.filterArray.length; filterIndex++) {
            var filter = $scope.filterArray[filterIndex];
            include = include && filter.call(filter, item, $scope.currentText, $scope.items);
          }
          return include;
        };

        $scope.$watch('filters', function(newCriteria) {
          $scope.filterArray = [];

          if (newCriteria && angular.isArray(newCriteria)) {
            $scope.filterArray = angular.copy(newCriteria);
          } else if(newCriteria && !angular.isArray(newCriteria)) {
            $scope.filterArray = [newCriteria];
          }

          $scope.filterArray.push(self.defaultTextFilter);
        }, true);

        $scope.updateHighlight = function(){
          var filteredItems = $filter('filter')($scope.items, $scope.filterCriteria, true);

          if ($scope.currentText === ''){
            $scope.highlightedItem = null;
            $scope.selectedItem = null;
          } else if (filteredItems && filteredItems.length > 0){
            //If previously highlighted item is filtered out, reset the highlight
            var highlightedIndex = filteredItems.indexOf($scope.highlightedItem);
            if (highlightedIndex < 0){
              $scope.highlightedItem = null;
              $scope.selectedItem = $scope.currentText;
            }

            if (angular.isDefined(filteredItems[0].getDisplay) && filteredItems[0].getDisplay() === $scope.currentText){
              //If the input exactly matches a result
              $scope.highlightedItem = filteredItems[0];
              $scope.selectedItem = filteredItems[0];
            } else {
              $scope.highlightedItem = filteredItems[0];
              $scope.selectedItem = $scope.currentText;
            }
          } else {
            $scope.highlightedItem = null;
            $scope.selectedItem = $scope.currentText;
          }
        };

        $scope.$watch('currentText', function() {
          $scope.updateHighlight();
        });

        $scope.$watch('selectedItem', function(newVal) {
          if (newVal === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('items', function(items) {
          if (angular.isDefined(items)){
            $scope.updateHighlight();
          }
        }, true);

        $scope.select = function(item) {
          if (! angular.isString(item)){
            $scope.currentText = angular.isDefined(item.getDisplay) ? item.getDisplay() : item[$scope.nameField];
          }

          $scope.selectedItem = item;
          $scope.onSelect({selectedItem: item});

          if (!$scope.keepExpanded) {
            $scope.hovering = false;
            $scope.showSuggestions = false;
          }
        };

        $scope.onBlur = function() {
          if (!$scope.keepExpanded) { //Prevents the button in multibox from jumping around
            $scope.showSuggestions = false;
          }
        };

        $scope.orderByFunction = function(item){
          var displayString = item.getDisplay();

          return displayString? displayString : item[$scope.nameField];
        };
      },
      link: function($scope, element) {
        element.find('input').bind('keydown keypress', function(event){
          var highlightedIndex;

          if (event.which === 13) { //Enter key
            $timeout(function(){
              var selected = $scope.highlightedItem ? $scope.highlightedItem : $scope.currentText;
              $scope.select(selected);
              $scope.onEnter({item: selected});
            });

            event.preventDefault();
          } else if(event.which === 40){ //Down arrow key
           highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex + 1 < $scope.filtered.length){
              $timeout(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex + 1];

                var li = element.find('li:nth-child(' + (highlightedIndex + 2) + ')');
                $scope.showListElement(li);
              });
            }
          } else if(event.which === 38){ //Up arrow key
            highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex - 1 >= 0){
              $timeout(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex - 1];

                //Scroll to this element in the dropdown
                var li = element.find('li:nth-child(' + highlightedIndex + ')');
                $scope.showListElement(li);
              });
            }
          }
        });

        $scope.showListElement = function(li){
          var elementTop = li.get(0).offsetTop;
          var elementHeight = li.get(0).offsetHeight;
          var elementBottom = elementTop + elementHeight;
          var containerHeight = element.find('ul').get(0).offsetHeight;
          var scrollTop = element.find('ul').get(0).scrollTop;

          if (elementBottom > (scrollTop + containerHeight)){
            element.find('ul').get(0).scrollTop = elementBottom - containerHeight;
          } else if (elementTop < scrollTop){
            element.find('ul').get(0).scrollTop = elementTop;
          }
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('uuid', [function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ctrl) {
        ctrl.$validators.uuid = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid - required will catch it if its not
            return true;
          }
          
          //regex from http://stackoverflow.com/a/13653180
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(viewValue)) {
            return true;
          }

          return false;
        };
      }
    };
  }]);

(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloEscalationListValidator', ['ZermeloEscalationList', 'jsedn',
      function (ZermeloEscalationList, jsedn) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attr, ctrl) {

            function validateZermelo(input) {
              var queryList = null;

              try {
                queryList = ZermeloEscalationList.fromEdn(input);
              } catch (e) {}

              ctrl.$setValidity('zermelo', !!queryList);

              return input;
            }

            ctrl.$parsers.unshift(validateZermelo);
            ctrl.$formatters.unshift(validateZermelo);
          }
        };
      }]);

})();

(function() {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('zermeloQueryValidator', ['ZermeloQuery', 'jsedn',
      function (ZermeloQuery, jsedn) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attr, ctrl) {

            function validateZermelo(input) {
              var query = null;

              try {
                query = ZermeloQuery.fromEdn(input);
              } catch (e) {}

              ctrl.$setValidity('zermelo', !!query);

              return input;
            }

            ctrl.$parsers.unshift(validateZermelo);
            ctrl.$formatters.unshift(validateZermelo);
          }
        };
      }]);

})();

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
  .filter('selectedTableOptions', ['$parse', '$filter', function ($parse, $filter) {
      return function (items, fields) {
        var filtered = [];

        if (angular.isUndefined(items)) {
          return filtered;
        }

        for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
          var item = items[itemIndex];
          var showItemInTable = true;
          for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            var field = fields[fieldIndex];
            
            //If this filter is currently hidden, skip it
            if (!field.checked) {
              continue;
            }

            if (!$parse('header.options')(field)) {
              continue;
            }

            var matchesColumnFilter = true;
            var lookup = field.lookup ? field.lookup : field.name;
            var options = $filter('invoke')(field.header.options);
            var checkedOptions = $filter('filter')(options, {
              checked : true
            }, true);

            //If there aren't any options available, skip this filter
            if (options.length === 0){
              continue;
            }

            if (checkedOptions.length === 0) {
              matchesColumnFilter = false; // Nothing can possibly match
            } else if (checkedOptions.length !== options.length) { // User has chosen a subset of options
              for (var i = 0; i < checkedOptions.length; i++) {
                var option = checkedOptions[i];

                var parseValue = $parse(field.header.valuePath ? field.header.valuePath : 'value');
                var value = $filter('invoke')(parseValue(option), option);

                if ($filter('matchesField')(item, lookup, value)) {
                  matchesColumnFilter = true;
                  break;
                } else {
                  matchesColumnFilter = false;
                }
              }
            }

            showItemInTable = showItemInTable && matchesColumnFilter;
            if (!showItemInTable) {
              break;
            }
          }

          if (showItemInTable) {
            filtered.push(item);
          }
        }

        return filtered;
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
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'queryCache', 'lodash', 'resultTransformer',
    function($http, $resource, $q, queryCache, _, resultTransformer) {
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

          Resource.hasItem = function(params, cacheKey) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            var cache = queryCache.get(key);

            if(!cache) {
              return false;
            }

            var item = _.find(cache, params);
            return !!item;
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
              cache.$promise = item.$promise;
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
  .factory('resultTransformer', [
    function() {
      return function (value) {
        if (value.result) {
          return value.result;
        }

        return value;
      };
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
      newScope.modalBody = 'liveops-config-panel-shared/services/modal/confirmModal.html';
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

angular.module('liveopsConfigPanel.shared.services')
  .service('modelResetService', ['toastr', '$window', function (toastr, $window) {
    this.reset = function reset(model) {
      if(!model.$original) {
        throw new Error('Model does not support reset');
        return;
      } else if(model.$reset) {
        return model.$reset();
      }
      
      for (var prop in model.$original) {
        if (prop.match(/^\$.*/g) ||
          angular.isFunction(model.$original[prop])) {
          continue;
        }
        model[prop] = angular.copy(model.$original[prop]);
      }
    };
  }]);
(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloCondition', ['jsedn', function (jsedn) {

      function Condition(tag, identifier) {
        this.tag = tag;
        this.identifier = identifier;
        this.filter = null;
      }

      Condition.prototype.setFilter = function () {
        if(arguments.length === 1) {
          this.filter = arguments[0];
        }

        if(arguments.length === 2) {
          this.filter = [arguments[0], arguments[1]];
        }
      };

      Condition.prototype.toEdn = function () {
        var ednFilter = this.filter instanceof Array ?
          new jsedn.List([new jsedn.Symbol(this.filter[0]), this.filter[1]]) :
          this.filter;

        return new jsedn.Map([new jsedn.Tagged(new jsedn.Tag(this.tag), this.identifier), ednFilter]);
      };

      Condition.fromEdn = function (edn) {
        if(edn instanceof jsedn.Map) {
          var condition = new Condition();

          // jsedn seems to ignore the #uuid tag? will have to investigate
          // the library to find out why. most other things work fine.
          // for now, manually inject uuid
          condition.tag = 'uuid';
          condition.identifier = edn.keys[0];
          condition.filter = edn.vals[0];

          if(!angular.isString(condition.identifier)) {
            throw 'condition must start with #uuid';
          }

          if(condition.filter instanceof jsedn.List) {

            if(condition.filter.val.length !== 2) {
              throw 'condition filter must be exactly length 2 if it is a list';
            }

            condition.filter = [condition.filter.val[0].val, condition.filter.val[1]];

          } else if(condition.filter !== true) {
            throw 'if condition filter is not a list, it must be true';
          }

          return condition;
        }

        throw 'condition must be a map';
      };

      return Condition;
    }]);

})();

(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloConditionGroup', ['jsedn', 'ZermeloCondition', '_',
      function (jsedn, ZermeloCondition, _) {

        function ConditionGroup(operator) {
          this.operator = operator;
          this.conditions = [];
        }

        ConditionGroup.prototype.getConditionIdentifiers = function () {
          var ids = [];

          for(var i = 0; i < this.conditions.length; i++) {
            ids.push(this.conditions[i].identifier);
          }

          return ids;
        };

        ConditionGroup.prototype.addCondition = function (condition) {
          this.conditions.push(condition);
        };

        ConditionGroup.prototype.removeCondition = function (condition) {
          _.pull(this.conditions, condition);
        };

        ConditionGroup.prototype.toEdn = function (allowEmpty) {
          var list = new jsedn.List([new jsedn.Symbol(this.operator)]);

          for (var i = 0; i < this.conditions.length; i++) {
            var condition = this.conditions[i].toEdn();

            if(allowEmpty || condition) {
              list.val.push(condition);
            }
          }

          return list.val.length > 1 || allowEmpty ? list : null;
        };

        ConditionGroup.fromEdn = function (edn) {
          if(edn instanceof jsedn.List) {
            var conditionGroup = new ConditionGroup();

            conditionGroup.operator = edn.at(0).val;

            for(var i = 1; i < edn.val.length; i++) {
              conditionGroup.addCondition(ZermeloCondition.fromEdn(edn.val[i]));
            }

            return conditionGroup;
          }

          throw 'condition group must be a list';
        };

        return ConditionGroup;
      }]);

})();

(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalation', ['_', 'ZermeloEscalationQuery', 'jsedn', 'ZermeloQuery',
      function (_, ZermeloEscalationQuery, jsedn, ZermeloQuery) {

        function Escalation() {
          this.query = new ZermeloEscalationQuery();
          this.afterSecondsInQueue = 0;
        }

        Escalation.ASIQ_KEY = new jsedn.Keyword(':after-seconds-in-queue');
        Escalation.QUERY_KEY = new jsedn.Keyword(':query');

        Escalation.prototype.hasConditions = function () {
          return this.query.hasConditions();
        };

        Escalation.fromSingleQuery = function (query) {
          var e = new Escalation(),
              q = ZermeloQuery.fromEdn(query);

          e.afterSecondsInQueue = 0;
          e.query.groups = q.groups;

          return e;
        };

        Escalation.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);
          map.set(Escalation.ASIQ_KEY, this.afterSecondsInQueue);
          map.set(Escalation.QUERY_KEY, this.query.toEdn(allowEmpty));
          return map;
        };

        Escalation.fromEdn = function (edn) {
          var e = new Escalation();

          if(edn instanceof jsedn.List) {
            return Escalation.fromSimpleQuery(edn);
          }

          if(edn instanceof jsedn.Map) {
            e.afterSecondsInQueue = edn.at(Escalation.ASIQ_KEY);
            e.query = ZermeloEscalationQuery.fromEdn(edn.at(Escalation.QUERY_KEY));

            if(!angular.isNumber(e.afterSecondsInQueue)) {
              throw 'after seconds in queue must be a number';
            }

            return e;
          }

          throw 'escalation query must be a map';
        };

        return Escalation;
      }]);

})();

(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalationList', ['_', 'ZermeloEscalation', 'jsedn',
      function (_, ZermeloEscalation, jsedn) {

        function EscalationList() {
          this.escalations = [];
        }

        EscalationList.prototype.addEscalation = function(escalation) {
          this.escalations.push(escalation);
        };

        EscalationList.prototype.removeEscalation = function(escalation) {
          _.pull(this.escalations, escalation);
        };

        EscalationList.fromSingleQuery = function(edn) {
          try {

            var ql = new EscalationList();

            ql.addEscalation(ZermeloEscalation.fromSingleQuery(edn));

            return ql;
          } catch (e) { }

          return null;
        };

        EscalationList.fromEdn = function (edn) {
          try {
            if(angular.isString(edn)) {
              var isSingleQuery = _.startsWith(edn, '{');

              edn = jsedn.parse(edn);

              if(isSingleQuery) {
                return EscalationList.fromSingleQuery(edn);
              }
            }

            if(edn instanceof jsedn.Vector) {
              var ql = new EscalationList();

              for(var i = 0; i < edn.val.length; i++) {
                ql.addEscalation(ZermeloEscalation.fromEdn(edn.val[i]));

                if(i > 0 && ql.escalations[i].afterSecondsInQueue <= ql.escalations[i-1].afterSecondsInQueue) {
                  throw 'after-seconds-in-queue must be increasing'
                }
              }

              return ql;
            }

            throw 'escalation list must be a vector';

          } catch (e) { }

          return null;
        };

        EscalationList.prototype.toEdn = function (allowEmpty) {
            if(!allowEmpty && this.escalations.length === 0) {
              return null;
            }

            var list = new jsedn.Vector([]);

            for (var i = 0; i < this.escalations.length; i++) {
              list.val.push(this.escalations[i].toEdn(allowEmpty));
            }

            return list;
        };

        return EscalationList;
      }]);

})();

(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalationQuery', ['_', 'jsedn', 'ZermeloObjectGroup',
      function (_, jsedn, ZermeloObjectGroup) {

        function EscalationQuery() {
          this.groups = [];
        }

        EscalationQuery.ALLOWED_KEYS = [
          ':skills',
          ':groups'
        ];

        EscalationQuery.prototype.hasConditions = function () {
          for(var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].hasConditions()) {
              return true;
            }
          }

          return false;
        };

        EscalationQuery.prototype.getGroup = function (key) {
          return _.findWhere(this.groups, {key: key}) || null;
        };

        EscalationQuery.prototype.setGroup = function (key, objectGroup) {
          this.groups.push({
            key: key,
            objectGroup: objectGroup
          });
        };

        EscalationQuery.prototype.removeGroup = function (key) {
          this.groups = _.filter(this.groups, function (item) {
            return item.key !== key;
          });
        };

        EscalationQuery.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);

          for(var i = 0; i < this.groups.length; i++) {
              var group = this.groups[i];
              map.set(new jsedn.Keyword(group.key), group.objectGroup.toEdn(allowEmpty));
          }

          return map;
        };

        EscalationQuery.fromEdn = function (edn) {
          var eq = new EscalationQuery();

          if(edn instanceof jsedn.Map) {

            edn.map(function (val, key) {
              if(_.includes(EscalationQuery.ALLOWED_KEYS, key.val)) {
                eq.setGroup(key.val, ZermeloObjectGroup.fromEdn(val));
              }
            });

            return eq;
          }

          throw 'escalation query must be a map';
        };

        return EscalationQuery;
      }]);

})();

(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloObjectGroup', ['jsedn', '_', 'ZermeloConditionGroup',
      function (jsedn, _, ZermeloConditionGroup) {

        function ObjectGroup() {
          this.andConditions = new ZermeloConditionGroup('and');
          this.orConditions = new ZermeloConditionGroup('or');
        }

        ObjectGroup.prototype.hasConditions = function () {
          return this.andConditions.conditions.length > 0 || this.orConditions.conditions.length > 0;
        };

        ObjectGroup.prototype.toEdn = function (allowEmpty) {
          var list = new jsedn.List([new jsedn.Symbol('and')]),
              conditionGroups = [this.andConditions, this.orConditions];

          for (var i = 0; i < conditionGroups.length; i++) {
            var conditionGroup = conditionGroups[i].toEdn(allowEmpty);

            if(allowEmpty || conditionGroup) {
              list.val.push(conditionGroup);
            }
          }

          return list.val.length > 1 ? list : null;
        };

        ObjectGroup.fromEdn = function (list) {
          if(list instanceof jsedn.List) {
              var og = new ObjectGroup();

              if(list.val[0].val !== 'and') {
                throw 'object group must start with and';
              }

              list.map(function (i) {
                if(i instanceof jsedn.List) {
                  switch (i.at(0).val) {
                    case 'and':
                      og.andConditions = ZermeloConditionGroup.fromEdn(i);
                      break;
                    case 'or':
                      og.orConditions = ZermeloConditionGroup.fromEdn(i);
                      break;
                    default:
                      throw 'condition group must start with \'and\' or \'or\' but found ' + i.at(0).val;
                  }
                }
              });

              return og;
          }

          throw 'object group must be a list'
        };

        return ObjectGroup;
      }]);

})();

(function () {
  'use strict';

  /**

    DEPRECATED:

    This class exists to support the old version of queue queries that existed
    before escalation queries were implemented.

  **/

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloQuery', ['_', 'ZermeloObjectGroup', 'jsedn',
      function (_, ZermeloObjectGroup, jsedn) {

        var ALLOWED_KEYS = [':groups', ':skills'];

        function Query() {
          this.groups = [];
          this.afterSecondsInQueue = 0;
        }

        Query.ALLOWED_GROUP_KEYS = ALLOWED_KEYS;

        Query.prototype.hasConditions = function () {
          for(var i = 0; i < this.groups.length; i++) {
              if(this.groups[i].objectGroup.hasConditions()) {
                return true;
              }
          }

          return false;
        };

        Query.prototype.getGroup = function (key) {
          return _.findWhere(this.groups, {key: key}) || null;
        };

        Query.prototype.setGroup = function (key, objectGroup) {
          this.groups.push({
            key: key,
            objectGroup: objectGroup
          });
        };

        Query.prototype.removeGroup = function (key) {
          this.groups = _.filter(this.groups, function (item) {
            return item.key !== key;
          });
        };

        Query.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);

          for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i],
                key = group.key,
                list = group.objectGroup.toEdn(allowEmpty);

            if(allowEmpty || list) {
              map.set(new jsedn.Keyword(key), list);
            }
          }

          return map;
        };

        Query.fromEdn = function (map) {

          if(map instanceof jsedn.Map) {
            var query = new Query(),
                keys = map.keys;

            for(var i = 0; i < keys.length; i++) {
              var key = keys[i];

              if (_.includes(ALLOWED_KEYS, key.val)) {
                query.setGroup(key.val, ZermeloObjectGroup.fromEdn(map.at(key)));
              } else {
                throw 'invalid key in query; must be in ' + angular.toJson(ALLOWED_KEYS);
              }
            }

            return query;
          }

          throw 'query must be a map';

        };

        return Query;
      }]);

})();

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editFieldDropDown', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'liveops-config-panel-shared/directives/editField/dropDown/editField_DropDown.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        defaultText: '@',
        name: '@',
        label: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editField', function () {
    return {
      restrict: 'E',
      templateUrl: 'liveops-config-panel-shared/directives/editField/input/editField_input.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        name: '@',
        label: '@',
        type: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ConditionGroupEditorController', ['$scope', 'ZermeloCondition', '_', '$translate',
      function ($scope, ZermeloCondition, _, $translate) {
        var vm = this;

        vm.conditionGroup = $scope.conditionGroup;
        vm.items = $scope.items;
        vm.sectionLabel = $scope.sectionLabel;
        vm.placeholderText = $scope.placeholderText;
        vm.conditionProficiency = 1;
        vm.conditionOperator = '>=';
        vm.readonly = $scope.readonly;

        vm.findItemForCondition = function(condition) {
          return  _.findWhere(vm.items, {id: condition.identifier});
        };

        vm.getConditionName = function (condition) {
          condition = vm.findItemForCondition(condition);

          if(condition) {
            return condition.getDisplay();
          }

          return $translate.instant('value.unknown');
        };

        vm.prettyConditionFilter = function (condition) {
          var item = vm.findItemForCondition(condition);

          if(item && condition.filter instanceof Array &&
                item.hasProficiency) {

            return condition.filter[0] + ' ' + condition.filter[1];
          }

          return '';
        };

        vm.addSelectedCondition = function() {
          var cond = new ZermeloCondition('uuid', vm.selectedItem.id);
          cond.setFilter(true);

          if(vm.selectedItem.hasProficiency === false) {
            cond.setFilter('>=', 1);
          }
          else if(vm.selectedItem.hasProficiency) {
            cond.setFilter(vm.conditionOperator, vm.conditionProficiency);
          }

          vm.conditionGroup.addCondition(cond);
          vm.selectedItem = null;
        };

        vm.conditionsFilter = function (item) {
          return !_.includes(vm.conditionGroup.getConditionIdentifiers(), item.id);
        };

      }]);


})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('conditionGroupEditor', function() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/conditionGroup/conditionGroupEditor.html',
        controller: 'ConditionGroupEditorController as cqe',
        scope: {
          conditionGroup: '=',
          items: '=',
          sectionLabel: '@',
          placeholderText: '@',
          readonly: '='
        }
      };
    });
 
})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationEditorController', ['$scope', 'ZermeloCondition', 'ZermeloObjectGroup',
      'ZermeloEscalationList', '_', '$translate', 'Modal', function ($scope,
        ZermeloCondition, ZermeloObjectGroup, ZermeloEscalationList, _, $translate, Modal) {

      var vm = this;

      vm.forms = {};
      vm.escalation = $scope.escalation;
      vm.afterSecondsMultiplier = 1;
      vm.timeAmount = vm.escalation.afterSecondsInQueue;
      vm.minSecondsRequired = $scope.minSeconds;
      vm.escalationQuery = $scope.previousEscalation;

      if(vm.escalation.afterSecondsInQueue) {
        vm.afterSecondsMultiplier = vm.escalation.afterSecondsInQueue % 60 === 0 ? 60 : 1;
        vm.afterTimeInQueue = vm.escalation.afterSecondsInQueue / vm.afterTimeMultiplier;
      };

      $scope.$watch('previousQuery.afterSecondsInQueue', function () {
        vm.checkMinValue();
      });

      vm.checkMinValue = function () {
        if(vm.escalationQuery && vm.forms.timeAfterForm && vm.forms.timeAfterForm.amount) {
          var validity = vm.escalationQuery.afterSecondsInQueue < vm.escalation.afterSecondsInQueue;
          vm.forms.timeAfterForm.amount.$setValidity('minTime', validity);

          if(!validity) {
            vm.forms.timeAfterForm.amount.$setTouched();
          }
        }
      };

      vm.afterTimeOptions = [
        {
          label: $translate.instant('queue.details.priorityUnit.seconds'),
          value: 1
        },
        {
          label: $translate.instant('queue.details.priorityUnit.minutes'),
          value: 60
        }
      ];

      vm.updateMultiplier = function () {
        switch (vm.afterSecondsMultiplier) {
          case 1:
            vm.timeAmount = vm.timeAmount * 60;
            break;
          case 60:
            vm.timeAmount = Math.ceil(vm.timeAmount / 60);
            break;
        }

        vm.updateTimeInSeconds();
      };

      vm.updateTimeInSeconds = function () {
        vm.escalation.afterSecondsInQueue = vm.timeAmount * vm.afterSecondsMultiplier;
        vm.checkMinValue();
      };

      vm.minTimeRequired = function (multiplier) {
        return vm.minSecondsRequired / multiplier;
      };
    }]);

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('escalationEditor', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalation/escalationEditor.html',
        controller: 'EscalationEditorController as ec',
        scope: {
          escalation: '=',
          previousEscalation: '=',
          minSeconds: '='
        }
      };
    });

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationListEditorController', ['$scope', 'ZermeloEscalationList', 'ZermeloEscalation', 'Modal', '$translate', '_',
      function ($scope, ZermeloEscalationList, ZermeloEscalation, Modal, $translate, _) {

        var vm = this;

        $scope.$watch(function (){
          return $scope.queryString;

        }, function (nv) {
          if(!vm.escalationList || (nv && nv !== vm.escalationList.toEdn().ednEncode())) {

            vm.advancedQuery = nv;

            var ednQuery = ZermeloEscalationList.fromEdn(nv);

            if(ednQuery) {
              return vm.initEscalationList(ednQuery);
            }

            vm.isAdvancedMode = true;
            vm.forms.advancedQueryForm.query.$setTouched();
          }
        });

        $scope.$watch(function () {
          return vm.escalationList;
        }, function (nv) {
          if(nv) {
            var edn = nv.toEdn();

            if(edn) {
              $scope.queryString = edn.ednEncode();
            } else {
              $scope.queryString = '()';
            }


          }
        }, true);

        vm.minSecondsForQuery = function (i) {
          if(i > 0) {
            return vm.escalationList.escalations[i - 1].afterSecondsInQueue + 1;
          }

          return 0;
        };

        vm.removeEscalation = function (escalation) {
          if(escalation.hasConditions()) {
            return Modal.showConfirm({
              message : $translate.instant('queue.query.escalation.level.remove.confirm'),
              okCallback: function () {
                vm.escalationList.removeEscalation(escalation);
              }
            });
          }

          return vm.escalationList.removeEscalation(escalation);
        };

        vm.addEscalation = function () {
          var q = new ZermeloEscalation();
          q.afterSecondsInQueue = _.last(vm.escalationList.escalations).afterSecondsInQueue + 1;
          vm.escalationList.addEscalation(q);
        };

        vm.advancedQueryChanged = function () {
          var ednQuery = ZermeloEscalationList.fromEdn(vm.advancedQuery);

          if(ednQuery) {
            if(!vm.initialAdvancedQuery ) {
              vm.initialAdvancedQuery = ednQuery;
            }

            $scope.queryString = ednQuery.toEdn().ednEncode();
          }
        };

        vm.advancedMode = function () {
          vm.advancedQuery = vm.escalationList.toEdn(true).ednEncode();
          vm.initialAdvancedQuery = vm.advancedQuery;
          vm.isAdvancedMode = true;
        };

        vm.basicMode = function () {
          var query = null;

          try {
            query = ZermeloEscalationList.fromEdn(vm.advancedQuery);
          } catch (e) {}

          if(!query) {
            return Modal.showConfirm(
              {
                message: $translate.instant('queue.details.version.query.basic.invalid'),
                okCallback: function () {
                  vm.initEscalationList(ZermeloEscalationList.fromEdn(vm.initialAdvancedQuery));
                  vm.isAdvancedMode = false;
                }
              }
            );
          }

          vm.initEscalationList(query);
          vm.isAdvancedMode = false;
        };

        vm.initEscalationList = function (escalationList) {
          vm.escalationList = escalationList || new ZermeloEscalationList();
        };
    }]);

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('queryListCreator', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalationList/escalationListEditor.html',
        controller: 'EscalationListEditorController as qlc',
        scope: {
          queryString: '='
        }
      };
    });

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationQueryEditorController', ['$scope', 'ZermeloEscalationQuery', 'ZermeloObjectGroup',
       '_', '$translate', 'Modal', function ($scope, ZermeloEscalationQuery, ZermeloObjectGroup, _, $translate, Modal) {

      var vm = this;
      vm.escalationQuery = $scope.escalationQuery;

      vm.addGroup = function (key) {
        vm.escalationQuery.setGroup(key, new ZermeloObjectGroup());
        vm.possibleGroups.splice(vm.possibleGroups.indexOf(key), 1);
        vm.currentGroup = '';
      };

      vm.verifyRemoveGroup = function (key) {
        if(vm.escalationQuery.getGroup(key).objectGroup.hasConditions()) {
          return Modal.showConfirm(
            {
              message: $translate.instant('queue.query.builder.remove.filter.confirm'),
              okCallback: function () {
                vm.removeGroup(key);
              }
            }
          );
        }

        return vm.removeGroup(key);
      };

      vm.removeGroup = function(key) {
        vm.escalationQuery.removeGroup(key);
        vm.possibleGroups.push(key);
      };

      vm.possibleGroups = _.xor(_.pluck(vm.escalationQuery.groups, 'key'), ZermeloEscalationQuery.ALLOWED_KEYS);
      vm.isAdvancedMode = false;
    }]);

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('escalationQueryEditor', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/escalationQuery/escalationQueryEditor.html',
        controller: 'EscalationQueryEditorController as eqc',
        scope: {
          escalationQuery: '='
        }
      };
    });

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ObjectGroupEditorController', ['$scope', '$translate', 'Session', 'Skill', 'Group',
      function ($scope, $translate, Session, Skill, Group) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
      vm.readonly = $scope.readonly;

      vm.modelType = vm.key === ':skills' ? Skill : Group;

      vm.items = vm.modelType.cachedQuery({
          tenantId: Session.tenant.tenantId
      });
    }]);

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('objectGroupEditor', function() {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/objectGroup/objectGroupEditor.html',
        controller: 'ObjectGroupEditorController as oge',
        scope: {
          objectGroup: '=',
          key: '=',
          readonly: '='
        }
      };
    });
})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .directive('proficiencySelector', function () {
      return {
        restrict: 'E',
        templateUrl: 'liveops-config-panel-shared/directives/queryEditor/proficiency/proficiencySelector.html',
        scope: {
          operator: '=',
          proficiency: '='
        }
      };
    });

})();

(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ReadonlyQueryController', ['$scope', 'ZermeloEscalationList',
      function ($scope, ZermeloEscalationList) {
        $scope.$watch('query', function (nv) {
          $scope.ednQuery = ZermeloEscalationList.fromEdn(nv);
          $scope.showBasicQuery = !!$scope.ednQuery;
        });
      }]);
})();

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('readonlyQuery', function () {
    return {
      restrict : 'E',
      scope : {
        query : '='
      },
      transclude : true,
      controller : 'ReadonlyQueryController',
      link : function ($scope, element, attrs, ctrl, transclude) {
        transclude($scope, function (clone) {
          element.append(clone);
        });
      }
    };
  });

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('validateCount', [function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ngModel) {
        $scope.$watchCollection(attrs.ngModel, function (newCollection) {
          if(newCollection) {
            ngModel.$setValidity(attrs.name, !!newCollection.length);
          } else {
            ngModel.$setValidity(attrs.name, false);
          }
        });
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.tenant.mock', ['liveopsConfigPanel.mock'])
  .service('mockTenants', function (Tenant) {
    return [new Tenant({
      'id': 'tenant-id'
    }), new Tenant({
      'id': 'tenant-id-2'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenants',
    function ($httpBackend, apiHostname, mockTenants) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id').respond({
        'result': mockTenants[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id-2').respond({
        'result': mockTenants[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants?regionId=regionId1').respond({
        'result': mockTenants
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id-0').respond(404);
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Tenant', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor) {

      var Tenant = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:id',
        resourceName: 'Tenant',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'active'
        }, {
          name: 'adminUserId'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Tenant.prototype.getDisplay = function () {
        return this.name;
      };
      
      //This is an awkward workaround for tenant list functionality 
      //in the case where list should only show current selected tenant due to having MANAGE_TENANT permission
      var obj = Tenant;
      Tenant.prototype.getAsArray = function(id){
        var cached = queryCache.get(id + 'arr');

        if (!cached) {
          var item = obj.get({id: id});
          var mockArray = [item];
          mockArray.$promise = item.$promise;
          mockArray.$resolved = true;
          queryCache.put(id + 'arr', mockArray);
          return mockArray;
        }

        return cached;
      };

      return Tenant;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Timezone', ['$resource', '$http', 'apiHostname', 'resultTransformer',
    function($resource, $http, apiHostname, resultTransformer) {
      return $resource(apiHostname + '/v1/timezones', {}, {
        query: {
          method: 'GET',
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          },
          transformResponse: Array.prototype.concat($http.defaults.transformResponse, resultTransformer),
          cache: true
        },
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.timezone.mock', ['liveopsConfigPanel.mock'])
  .service('mockTimezones', function () {
    return [
      'America/Edmonton',
      'America/Eirunepe',
      'America/El_Salvador',
      'America/Ensenada',
      'America/Fort_Wayne',
      'America/Fortaleza',
      'America/Glace_Bay',
      'America/Godthab',
      'America/Goose_Bay',
      'America/Grand_Turk',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Guatemala',
      'America/Guayaquil',
      'America/Guyana',
      'America/Halifax'
    ];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTimezones',
    function ($httpBackend, apiHostname, mockTimezones) {
      $httpBackend.when('GET', apiHostname + '/v1/timezones').respond({
        'result': mockTimezones
      });
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
'use strict';

angular.module('liveopsConfigPanel.tenant.businessHour.mock', ['liveopsConfigPanel.mock'])
  .service('mockBusinessHours', function (BusinessHour) {
    return [new BusinessHour({
      'id': 'businessHourId1',
      'name': 'bh1',
      'tenantId': 'tenant-id',
      'description': null,
      'active': true,
      'timezone': 'America/Argentina/Buenos_Aires',
      
      'sunStartTimeMinutes': null,
      'sunEndTimeMinutes': null,
      'monStartTimeMinutes': null,
      'monEndTimeMinutes': null,
      'tueStartTimeMinutes': null,
      'tueEndTimeMinutes': null,
      'wedStartTimeMinutes': null,
      'wedEndTimeMinutes': null,
      'thuStartTimeMinutes': null,
      'thuEndTimeMinutes': null,
      'friStartTimeMinutes': null,
      'friEndTimeMinutes': null,
      'satEndTimeMinutes': null,
      'satStartTimeMinutes': null,
      
      'exceptions': [{
        'id': 'businessHourException1',
        'businessHoursId': 'businessHour1',
        'date': '2016-12-10T00:00:00Z',
        'tenantId': 'tenant-id',
        'description': null,
        'isAllDay': false,
        'startTimeMinutes': 0,
        'endTimeMinutes': 480
      }, {
        'id': 'businessHourException2',
        'businessHoursId': 'businessHour1',
        'date': '2016-12-10T00:00:00Z',
        'tenantId': 'tenant-id',
        'description': null,
        'isAllDay': false,
        'startTimeMinutes': 60,
        'endTimeMinutes': 780
      }]
    }), new BusinessHour({
      'id': 'businessHourId2',
      'name': 'bh1',
      'tenantId': 'tenant-id',
      'description': null,
      'active': true,
      'timezone': 'America/Halifax',
      
      'sunStartTimeMinutes': 60,
      'sunEndTimeMinutes': 780,
      'monStartTimeMinutes': null,
      'monEndTimeMinutes': null,
      'tueStartTimeMinutes': null,
      'tueEndTimeMinutes': null,
      'wedStartTimeMinutes': null,
      'wedEndTimeMinutes': null,
      'thuStartTimeMinutes': null,
      'thuEndTimeMinutes': null,
      'friStartTimeMinutes': null,
      'friEndTimeMinutes': null,
      'satEndTimeMinutes': null,
      'satStartTimeMinutes': null,
      'exceptions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockBusinessHours',
    function ($httpBackend, apiHostname, mockBusinessHours) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1').respond({
        'result': mockBusinessHours[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId2').respond({
        'result': mockBusinessHours[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours').respond({
        'result': [mockBusinessHours[0], mockBusinessHours[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId0').respond(404);
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('businessHourTransformer', ['BusinessHourException', function(BusinessHourException) {
    this.transform = function(businessHour) {
      businessHour.$exceptions = [];
      for(var index = 0; index < businessHour.exceptions.length; index++) {
        var exception = new BusinessHourException(businessHour.exceptions[index]);
        businessHour.$exceptions.push(exception);
        delete businessHour.exceptions[index];
      }
    };
  }])
  .service('businessHourInterceptor', ['businessHourTransformer',
    function(businessHourTransformer) {
      this.response = function(response) {
        var businessHour = response.resource;

        businessHourTransformer.transform(businessHour);

        return businessHour;
      };
    }
  ])
  .service('businessHourQueryInterceptor', ['businessHourTransformer',
    function(businessHourTransformer) {
      this.response = function(response) {
        angular.forEach(response.resource, function(businessHour) {
          businessHourTransformer.transform(businessHour);
        });

        return response.resource;
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('BusinessHour', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor', 'businessHourInterceptor', 'businessHourQueryInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, businessHourInterceptor, businessHourQueryInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:id',
        resourceName: 'BusinessHour',
        updateFields: [{
          name: 'name'
        }, {
          name: 'active'
        }, {
          name: 'timezone'
        }, {
          name: 'sunStartTimeMinutes',
          optional: true
        }, {
          name: 'sunEndTimeMinutes',
          optional: true
        }, {
          name: 'monStartTimeMinutes',
          optional: true
        }, {
          name: 'monEndTimeMinutes',
          optional: true
        }, {
          name: 'tueStartTimeMinutes',
          optional: true
        }, {
          name: 'tueEndTimeMinutes',
          optional: true
        }, {
          name: 'wedStartTimeMinutes',
          optional: true
        }, {
          name: 'wedEndTimeMinutes',
          optional: true
        }, {
          name: 'thuStartTimeMinutes',
          optional: true
        }, {
          name: 'thuEndTimeMinutes',
          optional: true
        }, {
          name: 'friStartTimeMinutes',
          optional: true
        }, {
          name: 'friEndTimeMinutes',
          optional: true
        }, {
          name: 'satStartTimeMinutes',
          optional: true
        }, {
          name: 'satEndTimeMinutes',
          optional: true
        }],
        getInterceptor: businessHourInterceptor,
        queryInterceptor: businessHourQueryInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      BusinessHours.prototype.getDisplay = function () {
        return this.name;
      };

      return BusinessHours;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('DispatchMapping', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var DispatchMapping = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dispatch-mappings/:id',
        resourceName: 'DispatchMapping',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'value',
          optional: true
        }, {
          name: 'flowId',
          optional: true
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'interactionField',
          optional: true
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      DispatchMapping.prototype.getDisplay = function () {
        return this.name;
      };

      return DispatchMapping;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.flow.mock', ['liveopsConfigPanel.mock'])
  .service('mockFlows', function(Flow){
    return [new Flow({
      name: 'f1',
      tenantId: 'tenant-id',
      description: 'A pretty good flow',
      id: 'flowId1'
    }), new Flow({
      name: 'f2',
      tenantId: 'tenant-id',
      description: 'Not as cool as the other flow',
      id: 'flowId2'
    }), new Flow({
      name: 'f3',
      tenantId: 'tenant-id',
      description: 'Das flow',
      id: 'flowId3'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockFlows', 'Session',
    function ($httpBackend, apiHostname, mockFlows, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id).respond({
        'result': mockFlows[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[1].id).respond({
        'result': mockFlows[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows').respond({
        'result': mockFlows
      });
      
      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows').respond({
        'result': mockFlows[2]
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Flow', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var Flow = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:id',
        resourceName: 'Flow',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion'
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'type'
        }, {
          name: 'active'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Flow.prototype.getDisplay = function () {
        return this.name;
      };

      return Flow;
    }
  ]);
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

angular.module('liveopsConfigPanel.shared.services')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor) {

      var Integration = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/integrations/:id',
        resourceName: 'Integration',
        updateFields: [{
          name: 'properties'
        }, {
          name: 'accountSid'
        }, {
          name: 'authToken'
        }, {
          name: 'webRtc'
        }, {
          name: 'active'
        }],
        updateInterceptor: emitInterceptor
      });

      Integration.prototype.getDisplay = function () {
        return this.type;
      };

      return Integration;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.integration.mock', ['liveopsConfigPanel.mock'])
  .service('mockIntegrations', function (Integration) {
    return [new Integration({
      'id': 'integrationId1'
    }), new Integration({
      'id': 'integrationId2'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockIntegrations',
    function ($httpBackend, apiHostname, mockIntegrations) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations').respond({
        'result': mockIntegrations
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations/integrationId1').respond({
        'result': mockIntegrations[0]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations/integrationId2').respond({
        'result': mockIntegrations[1]
      });

    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('itemBackupInterceptor', [function () {
    this.response = function (response) {
      var lists = response.resource;

      if (!angular.isArray(lists)) {
        lists = [lists];
      }

      angular.forEach(lists, function (list) {
        angular.forEach(list.items, function (item) {
          item.$original = angular.copy(item);
        });
      });

      return response.resource;
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.tenant.list.mock', ['liveopsConfigPanel.mock'])
  .service('mockLists', ['List', function (List) {
    return [new List({
      'id': 'listId1',
      'listTypeId': 'listTypeId1',
      'items': [{
        'field1': 'string value',
        'field2': 33,
        'field3': true
      }]
    }), new List({
      'id': 'listId2',
      'listTypeId': 'listTypeId2'
    }), new List({
      'id': 'listId3',
      'listTypeId': 'listTypeId1'
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockLists',
    function ($httpBackend, apiHostname, mockLists) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond({
        'result': mockLists[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/lists/listId2').respond({
        'result': mockLists[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/lists').respond({
        'result': [mockLists[0], mockLists[1]]
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('List', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor', 'itemBackupInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor, itemBackupInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/lists/:id',
        resourceName: 'List',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'items'
        }, {
          name: 'active'
        }],
        getInterceptor: itemBackupInterceptor,
        queryInterceptor: itemBackupInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor, itemBackupInterceptor],
        updateInterceptor: [emitInterceptor, itemBackupInterceptor]
      });

      List.prototype.getDisplay = function () {
        return this.name;
      };
      
      return List;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.listType.mock', ['liveopsConfigPanel.mock'])
  .service('mockListTypes', ['ListType', function (ListType) {
    return [new ListType({
      'id': 'listTypeId1',
      'fields': [{
        'type': 'string',
        'name': 'field1',
        'label': 'String field',
        'required': true
      }, {
        'type': 'number',
        'name': 'field2',
        'label': 'Number field',
        'required': false
      }, {
        'type': 'boolean',
        'name': 'field3',
        'label': 'Bool field',
        'required': false
      }]
    }), new ListType({
      'id': 'listTypeId2',
      'fields': [{
        'type': 'boolean',
        'name': 'field1',
        'label': 'Bool field',
        'required': true
      }]
    }), new ListType({
      'id': 'listTypeId3',
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockListTypes',
    function ($httpBackend, apiHostname, mockListTypes) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/list-types/listTypeId1').respond({
        'result': mockListTypes[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/list-types/listTypeId2').respond({
        'result': mockListTypes[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/list-types').respond({
        'result': [mockListTypes[0], mockListTypes[1]]
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ListType', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, queryCache, cacheAddInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/list-types/:id',
        resourceName: 'ListType',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      List.prototype.getDisplay = function () {
        return this.name;
      };
      
      return List;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.media.mock', ['liveopsConfigPanel.mock'])
  .value('medias', [{
    id: 'm1'
  }, {
    id: 'm2'
  }])
  .run(function($httpBackend, apiHostname, Session, medias) {
    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media').respond({
      'result': medias
    });
  });
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Media', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {

      var Media = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media/:id',
        resourceName: 'Media',
        updateFields: [{
          name: 'name'
        }, {
          name: 'source'
        }, {
          name: 'type'
        }, {
          name: 'properties',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor]
      });

       Media.prototype.getDisplay = function (){
       return this.name;
      };
    
      return Media;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.tenant.mediaCollection.mock', ['liveopsConfigPanel.mock'])
  .service('mockMediaCollections', function (MediaCollection) {
    return [new MediaCollection({
      id: 'mc1'
    }), new MediaCollection({
      id: 'mc2'
    })];
  })
  .service('mockMedias', function (Media) {
    return [new Media({
      id: 'm1'
    }), new Media({
      id: 'm2'
    })];
  })
  .run(function ($httpBackend, apiHostname, Session, mockMedias, mockMediaCollections) {
    Session.tenant = {
      tenantId: '1'
    };
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media').respond(200, mockMedias);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media-collections').respond(200, mockMediaCollections);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/2/media').respond(200, mockMedias);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/2/media-collections').respond(200, mockMediaCollections);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/3/media').respond(200, []);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/3/media-collections').respond(200, []);
  });
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('MediaCollection', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'mediaCollectionMapCleanTransformer',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, mediaCollectionMapCleanTransformer) {

      var MediaCollection = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media-collections/:id',
        resourceName: 'MediaCollection',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'mediaMap',
          optional: true
        }, {
          name: 'defaultMediaKey',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        putRequestTransformer: mediaCollectionMapCleanTransformer
      });

      return MediaCollection;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Queue', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var Queue = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/queues/:id',
        resourceName: 'Queue',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion',
          optional: true
        }, {
          name: 'active'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Queue.prototype.getDisplay = function () {
        return this.name;
      };

      return Queue;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.tenant.queue.mock', ['liveopsConfigPanel.mock'])
  .service('mockQueues', ['Queue', function(Queue) {
    return [new Queue({
      name: 'q1',
      tenantId: 'tenant-id',
      description: 'A pretty good queue',
      id: 'queueId1'
    }), new Queue({
      name: 'q2',
      tenantId: 'tenant-id',
      description: 'Not as cool as the other queue',
      id: 'queueId2'
    }), new Queue({
      name: 'f3',
      tenantId: 'tenant-id',
      description: 'Das queue',
      id: 'queueId3'
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockQueues', 'Session',
    function ($httpBackend, apiHostname, mockQueues, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/' + mockQueues[0].id).respond({
        'result': mockQueues[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/' + mockQueues[1].id).respond({
        'result': mockQueues[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues').respond({
        'result': mockQueues
      });
      
      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues').respond({
        'result': mockQueues[2]
      });
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

      var tenantUserStatusUpdateTransformer = function (obj) {
        var cpy = angular.copy(obj);

        if(obj.$original && obj.status === obj.$original.status) { 
          delete cpy.status;
        }

        return cpy;
      };

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
        putRequestTransformer: tenantUserStatusUpdateTransformer,
        postRequestTransformer: tenantUserStatusUpdateTransformer,
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
      'status': 'accepted',
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
  .factory('BusinessHourException', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:businessHourId/exceptions/:id',
        resourceName: 'BusinessHourException',
        updateFields: [{
          name: 'date'
        }, {
          name: 'isAllDay'
        }],

        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      BusinessHours.prototype.getDisplay = function () {
        return this.name;
      };

      return BusinessHours;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('FlowDraft', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', '$http',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, $http) {

      var endpoint = apiHostname + '/v1/tenants/:tenantId/flows/:flowId/drafts/:id';

      var FlowDraft = LiveopsResourceFactory.create({
        endpoint: endpoint,
        resourceName: 'FlowDraft',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'flowId'
        }, {
          name: 'flow'
        }, {
          name: 'history'
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      FlowDraft.prototype.getDisplay = function () {
        return this.name;
      };

      FlowDraft.prototype.validate = function () {
        var url = apiHostname + '/v1/tenants/' + this.tenantId + '/flows/' + this.flowId + '/drafts/' + this.id + '/validate';

        return $http({
          method: 'POST',
          url: url
        }).then(function successCallback() {
          return true;
        }, function errorCallback(response) {
          return response;
        });
      };

      return FlowDraft;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.tenant.flow.draft.mock', [
    'liveopsConfigPanel.mock',
    'liveopsConfigPanel.tenant.flow.mock'
  ])
  .value('mockFlowDrafts', [{
    name: 'Draft 1',
    version: 'flowDraftId1',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 2',
    version: 'flowDraftId2',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 3',
    version: 'flowDraftId3',
    flowId: 'flowId2',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 4',
    version: 'flowDraftId4',
    flowId: 'flowId3',
    tenantId: 'tenant-id',
    flow: '[]'
  }])
  .run(['$httpBackend', 'apiHostname', 'mockFlows', 'mockFlowDrafts', 'Session',
    function ($httpBackend, apiHostname, mockFlows, mockFlowDrafts, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts/' + mockFlowDrafts[0].id).respond({
        'result': mockFlowDrafts[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts/' + mockFlowDrafts[1].id).respond({
        'result': mockFlowDrafts[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[1].id + '/drafts/' + mockFlowDrafts[2].id).respond({
        'result': mockFlowDrafts[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts').respond({
        'result': [mockFlowDrafts[0], mockFlowDrafts[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[2].id + '/drafts').respond({
        'result': mockFlowDrafts[3]
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('FlowVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor) {

      var FlowVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:flowId/versions/:version',
        resourceName: 'FlowVersion',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'flowId'
        }, {
          name: 'flow'
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      FlowVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return FlowVersion;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.tenant.flow.version.mock', [
    'liveopsConfigPanel.mock',
    'liveopsConfigPanel.tenant.flow.mock'
  ])
  .value('mockFlowVersions', [{
    name: 'v1',
    version: 'flowVersionId1',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v2',
    version: 'flowVersionId2',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v3',
    version: 'flowVersionId3',
    flowId: 'flowId2',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v4',
    version: 'flowVersionId4',
    flowId: 'flowId3',
    tenantId: 'tenant-id',
    flow: '[]'
  }])
  .run(['$httpBackend', 'apiHostname', 'mockFlows', 'mockFlowVersions', 'Session',
    function ($httpBackend, apiHostname, mockFlows, mockFlowVersions, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions/' + mockFlowVersions[0].id).respond({
        'result': mockFlowVersions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions/' + mockFlowVersions[1].id).respond({
        'result': mockFlowVersions[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[1].id + '/versions/' + mockFlowVersions[2].id).respond({
        'result': mockFlowVersions[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions').respond({
        'result': [mockFlowVersions[0], mockFlowVersions[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[2].id + '/versions').respond({
        'result': mockFlowVersions[3]
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.tenant.queue.version.mock', ['liveopsConfigPanel.mock'])
  .service('mockQueueVersions', ['QueueVersion', function(QueueVersion) {
    return [new QueueVersion({
      version: 'qv1',
      tenantId: 'tenant-id',
      queueId: 'queueId1'
    }), new QueueVersion({
      version: 'qv2',
      tenantId: 'tenant-id',
      queueId: 'queueId2'
    }), new QueueVersion({
      version: 'qv3',
      tenantId: 'tenant-id',
      queueId: 'queueId2'
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockQueueVersions', 'Session',
    function ($httpBackend, apiHostname, mockQueueVersions, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/queueId1/versions').respond({
        'result': [mockQueueVersions[0]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/queueId2/versions').respond({
        'result': [mockQueueVersions[1], mockQueueVersions[2]]
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('QueueVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var QueueVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/queues/:queueId/versions/:id',
        resourceName: 'QueueVersion',
        updateFields: [
          {name: 'name', optional: true},
          {name: 'description', optional: true},
          {name: 'query', optional: true},
          {name: 'minPriority', optional: true},
          {name: 'maxPriority', optional: true},
          {name: 'priorityValue', optional: true},
          {name: 'priorityRate', optional: true},
          {name: 'priorityUnit', optional: true}
        ],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      QueueVersion.prototype.getDisplay = function () {
        return this.name;
      };
      
      QueueVersion.prototype.cacheKey = function () {
        return 'QueueVersion' + this.queueId;
      };

      return QueueVersion;
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
