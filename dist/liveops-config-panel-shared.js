'use strict';

(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('liveopsConfigPanel.shared.config', [])
    .value('liveopsConfigPanel.shared.config', {
      debug: true
    })
    .value('apiHostname', 'http://localhost:9080');
  
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
// angular.module('liveopsConfigPanel.shared.config')
//   .value('apiHostname', 'http://localhost:9080')
//   .constant('BIRST_URL', 'https://dev-birst.liveopslabs.com')
//   .constant('SSO_PASSWORD', 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh')
//   .constant('SPACE_ID', '2846b565-23f8-4032-b563-21f8b7a01cc5')
//   .constant('helpDocsHostname', 'http://beta-help-docs.liveopslabs.com');

'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.shared.config')

.constant('jsedn', window.jsedn)

.constant('_', window._)

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.constant('apiErrorKeys', ['required'])

;

'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.shared.config')

.constant('twilioLangs', [{
  'value': 'da-DK',
  'display': 'Danish, Denmark'
}, {
  'value': 'de-DE',
  'display': 'German, Germany'
}, {
  'value': 'en-AU',
  'display': 'English, Australia'
}, {
  'value': 'en-CA',
  'display': 'English, Canada'
}, {
  'value': 'en-GB',
  'display': 'English, UK'
}, {
  'value': 'en-IN',
  'display': 'English, India'
}, {
  'value': 'en-US',
  'display': 'English, United States'
}, {
  'value': 'ca-ES',
  'display': 'Catalan, Spain'
}, {
  'value': 'es-ES',
  'display': 'Spanish, Spain'
}, {
  'value': 'es-MX',
  'display': 'Spanish, Mexico'
}, {
  'value': 'fi-FI',
  'display': 'Finnish, Finland'
}, {
  'value': 'fr-CA',
  'display': 'French, Canada'
}, {
  'value': 'fr-FR',
  'display': 'French, France'
}, {
  'value': 'it-IT',
  'display': 'Italian, Italy'
}, {
  'value': 'ja-JP',
  'display': 'Japanese, Japan'
}, {
  'value': 'ko-KR',
  'display': 'Korean, Korea'
}, {
  'value': 'nb-NO',
  'display': 'Norwegian, Norway'
}, {
  'value': 'nl-NL',
  'display': 'Dutch, Netherlands'
}, {
  'value': 'pl-PL',
  'display': 'Polish-Poland'
}, {
  'value': 'pt-BR',
  'display': 'Portuguese, Brazil'
}, {
  'value': 'pt-PT',
  'display': 'Portuguese, Portugal'
}, {
  'value': 'ru-RU',
  'display': 'Russian, Russia'
}, {
  'value': 'sv-SE',
  'display': 'Swedish, Sweden'
}, {
  'value': 'zh-CN',
  'display': 'Chinese (Mandarin)'
}, {
  'value': 'zh-HK',
  'display': 'Chinese (Cantonese)'
}, {
  'value': 'zh-TW',
  'display': 'Chinese (Taiwanese Mandarin)'
}])

.constant('twilioVoices', [{
  'value': 'man',
  'display': 'man'
}, {
  'value': 'woman',
  'display': 'woman'
}, {
  'value': 'alice',
  'display': 'alice'
}])

;

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('newResource', [function() {
    return function(resources, inverse) {
      var returnList = [];
      if(!resources) {
        return;
      }
      
      for(var index = 0; index < resources.length; index++) {
        var resource = resources[index];
        if(resource.isNew) {
          resource.$originalIndex = index;
          if((!inverse && resource.isNew()) || (inverse && !resource.isNew())) {
            returnList.push(resource);
          }
        }
      }
      
      return returnList;
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
      /** audit-text attribute and element directive
       * Generate formatted audit text like "Created by Titan User on Dec 7, 2015 12:52:46 PM"
       */
      return {
        restrict: 'AE',
        scope: {
          translation: '@', // (string) The translation key, with placeholder for date and optionally 'displayName'
          userId: '=', // (int) Optional userId. If given, User will be queried and the user's display name will be passed to the translate filter as 'displayName'
          date: '=' // (date) The date to be formatted to 'medium' format and passed to the translate filter as 'date'
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
        onEnter: '&',
        disabled: '@'
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
        $scope.executing = true;
        var selectedBulkActions = self.getCheckedItems($scope.bulkActions);
        var itemPromises = [];
        
        angular.forEach(selectedBulkActions, function (bulkAction) {
          if (bulkAction.canExecute()) {
            var selectedItems = self.getCheckedItems($scope.items);
            itemPromises.push($q.when(bulkAction.execute(selectedItems)));
          }
        });

        return $q.all(itemPromises).finally(function(){
          $scope.executing = false;
        });
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
    /** bulk-action-executor element directive
     * Generate the bulk actions panel. This directive uses transclusion to provide the panel content
     */
      return {
        restrict: 'E',
        scope: {
          items: '=', // (array) List of items from the table
          showBulkActions: '=', // (boolean) Used for tracking whether or not to show the bulk actions panel. Set to false when panel is closed by user
          dropOrderBy: '@', // (string) The item property used to sort the dropdown list of items that are selected for editing
          confirmMessageKey: '@' // (string) Translation key for the confirm dialog message displayed to the user when they submit
        },
        transclude: true,
        templateUrl: 'liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        controller: 'bulkActionExecutorController',
        link: function ($scope, elem, attrs, controller, transclude) {
          transclude($scope.$parent, function (clone) {
            elem.find('.detail-body').append(clone);
          });

          if (!$scope.confirmMessageKey) {
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }

          $scope.checkedItems = [];

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
            //Preserve the binding to checkedItems, but update the array contents
            $scope.checkedItems.clear();
            $scope.checkedItems.push.apply($scope.checkedItems, controller.getCheckedItems($scope.items));

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
            angular.forEach($scope.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

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
            if (! resource){
              return;
            }

            var action = resource.updated ? 'updated' : 'saved';
            Alert.success('Record ' + action);
          };

          this.alertFailure = function(resource) {
            if (! resource){
              return;
            }

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
          //TODO: Consider loFormReset loReset instead. This one introduces too much coupling.
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
  .controller('loFormResetController', ['$scope', '$timeout', 'modelResetService', 'DirtyForms',
    function ($scope, $timeout, modelResetService, DirtyForms) {
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

      vm.resetErrors = function () {
        for (var errorIndex in vm.formController.$error) {
          var errorFields = vm.formController.$error[errorIndex];

          for (var errorFieldIndex = 0; errorFieldIndex < errorFields.length; errorFields++) {
            var error = errorFields[errorFieldIndex];
            error.$setValidity(errorIndex, true);
          }
        }
      };

      vm.reset = function reset(model) {
        modelResetService.reset(model);
        vm.resetForm(vm.formController);
      };

      vm.onEvent = function (model) {
        DirtyForms.confirmIfDirty(function () {
          return $timeout(function(){
            return vm.reset(model);
          });
        });
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
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, formController) {
          var controller = elem.data('$loFormResetController');
          controller.formController = formController;
          formController.loFormResetController = controller;
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormResetWatch', [
    function () {
      return {
        restrict: 'A',
        require: ['ngModel', 'form'],
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, ctrls) {
          var formController = ctrls[1];
          var controller = elem.data('$loFormResetWatchController');
          controller.formController =formController;
          formController.resetController = controller;

          scope.$watch(attrs.ngModel, function(newResource, oldResource) {
            if(oldResource) {
              controller.reset(oldResource);
            }
          });
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
            if (!$parse('data.error')(error)){
              console.warn('Could not parse data.error from:', error);
              return error;
            }
            
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

            return error;
          };
        },
        link: function($scope, $elem, $attrs, form) {
          var controller = $elem.data('$loFormSubmitController');
          controller.formController = form;
          form.loFormSubmitController = controller;
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loReset', ['$q', '$parse',
    function ($q, $parse) {
      return {
        restrict: 'A',
        require: ['^form', 'ngModel'],
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, ctrls) {
          var controller = elem.data('$loResetController');
          controller.formController = ctrls[0];
          controller.ngModel = ctrls[1];
          
          if(attrs.name) {
            $parse(attrs.name).assign(scope, controller);
          }
          
          attrs.event = angular.isDefined(attrs.event) ? attrs.event : 'click';
          elem.bind(attrs.event, function () {
            var promise = $q.when(scope.$eval(attrs.loReset));

            promise.then(function (model) {
              model = model ? model : controller.ngModel.$modelValue;
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
      require: ['^loFormSubmit', '?^loFormCancel', '?^loFormReset', '?^loFormAlert'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        var loFormReset = $ctrl[2];
        var loFormAlert = $ctrl[3];

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
            } else if(loFormReset) {
              loFormReset.resetForm();
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
        });
      }
    };
  }]);

angular.module("liveopsConfigPanel.shared.directives").run(["$templateCache", function($templateCache) {$templateCache.put("liveops-config-panel-shared/directives/autocomplete/autocomplete.html","<div class=\"autocomplete-container\">\n  <input\n    autocomplete=\"off\"\n    name=\"{{nameField}}\"\n    ng-required=\"isRequired\"\n    type=\"text\"\n    ng-disabled=\"{{disabled}}\"\n    ng-model=\"currentText\"\n    ng-focus=\"showSuggestions=true\"\n    ng-blur=\"onBlur()\"\n    placeholder=\"{{placeholder}}\"\n    ng-keypress=\"($event.which === 13) ? onEnter() : 0\"></input>\n    <i class=\"fa fa-search\"></i>\n    <ul ng-class=\"{\'embeded\' : !hover}\" ng-show=\"filtered.length > 0 && (showSuggestions || hovering)\" ng-mouseover=\"hovering=true\" ng-mouseout=\"hovering=false\">\n      <li class=\"lo-hover-highlight\" ng-class=\"{\'highlight\' : selectedItem == item, \'lo-highlight\' : selectedItem == item}\" ng-click=\"select(item)\" ng-repeat=\"item in filtered = (items | filter:filterCriteria | orderBy:nameField)\">{{item[nameField] || item.getDisplay()}}</li>\n    </ul>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/bulkActionExecutor/bulkActionExecutor.html","<form id=\"bulk-action-form\" name=\"bulkActionForm\" class=\"details-pane\" unsaved-changes-warning>\n  <i id=\"close-bulk-button\" class=\"fa fa-remove remove\" ng-click=\"closeBulk()\"></i>\n  <div id=\"bulk-actions-selected-header\" class=\"detail-header\">\n    <filter-dropdown\n      label=\"{{\'bulkActions.selected\' | translate}}({{selectedItems().length}})\"\n      options=\"selectedItems()\"\n      display-path=\"getDisplay\"\n      value-path=\"id\">\n    </filter-dropdown>\n  </div>\n\n  <div class=\"detail-body\">\n    <!-- bulkAction elements injected here -->\n  </div>\n\n  <div class=\"detail-controls\">\n    <input id=\"cancel-bulk-actions-btn\"\n      type=\"button\"\n      class=\"btn\"\n      ng-click=\"cancel()\"\n      value=\"{{\'value.cancel\' | translate}}\">\n    </input>\n    <input id=\"submit-bulk-actions-btn\"\n      ng-disabled=\"!canExecute()\"\n      type=\"button\"\n      class=\"btn btn-primary\"\n      ng-click=\"confirmExecute()\"\n      value=\"{{\'value.submit\' | translate}}\"\n      lo-submit-spinner\n      lo-submit-spinner-status=\"executing\">\n  </div>\n</form>\n");
$templateCache.put("liveops-config-panel-shared/directives/dropdown/dropdown.html","<div class=\"dropdown-wrapper\">\n  <div class=\"drop-label\" ng-class=\"{\'drop-origin\' : showDrop}\" ng-click=\"dropClick()\" ng-mouseenter=\"mouseIn()\">\n    <div>\n      <span>{{label}}</span>\n      <i id=\"nav-dropdown-down-arrow\" ng-show=\"showDrop\" class=\"{{collapseIcon}} label-icon\"></i>\n      <i ng-show=\"! showDrop\" class=\"{{expandIcon}} label-icon\"></i>\n    </div>\n  </div>\n\n  <div class=\"dropdown-container\">\n    <div class=\"dropdown\" ng-hide=\"! showDrop\">\n      <ul>\n        <li id=\"{{item.id}}\"\n          ng-repeat=\"item in items | orderBy:orderBy\"\n          ng-click=\"optionClick(item.onClick)\">\n            <span class=\"lo-hover-highlight lo-accent-hover-border\" ng-if=\"! item.stateLink\"><i class=\"{{item.iconClass}}\"></i>{{item[displayPath]}}</span>\n            <a class=\"lo-hover-highlight lo-accent-hover-border\" ng-if=\"item.stateLink\" ui-sref=\"{{item.stateLink}}\" ui-sref-opts=\"{{item.stateLinkParams}}\"><i class=\"{{item.iconClass}}\"></i>{{item[displayPath]}}</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/dropdown/filterDropdown.html","<div class=\"dropdown-label\" ng-click=\"showDrop = ! showDrop\">\n  <span>{{label}}</span>\n  <div ng-if=\"showAll\" class=\"all-label\">\n    <span ng-if=\"all.checked\"><span ng-if=\"label\">:</span> All</span>\n    <span ng-if=\"!all.checked\"><span ng-if=\"label\">:</span> (...)</span>\n  </div>\n  <span><i class=\"fa\" ng-class=\"{\'fa-caret-up\' : showDrop, \'fa-caret-down\' : ! showDrop}\"></i></span>\n</div>\n\n<div class=\"dropdown-container\">\n  <div class=\"dropdown filter-dropdown\" ng-hide=\"! showDrop || options.length === 0\">\n    <div class=\"all lo-accent-hover-box-border lo-hover-highlight\" ng-if=\"showAll\" ng-click=\"toggleAll()\">\n      <input type=\"checkbox\" ng-checked=\"all.checked\"/>\n      <label>All</label>\n    </div>\n    <div ng-repeat=\"option in options | orderBy:orderBy\"\n      class=\"dropdown-option lo-accent-hover-box-border lo-hover-highlight\" ng-click=\"checkItem(option)\" >\n      <input name=\"{{option | parse:valuePath | invoke:option}}\" type=\"checkbox\" ng-checked=\"option.checked\"/>\n      <label for=\"{{option | parse:valuePath | invoke:option}}\">\n        {{option | parse:displayPath | invoke:option}}\n      </label>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/formError/formError.html","<div class=\"lo-error\" role=\"alert\" ng-if=\'field.$touched && field.$invalid\' ng-messages=\"field.$error\">\n  <div ng-repeat=\"(error, value) in field.$error\" >\n    <span ng-message=\"{{error}}\" ng-if=\"isString(value)\">{{value}}</span>\n    <span ng-message=\"{{error}}\" ng-if=\"value === true\">{{errorTypes[error]}}</span>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/helpIcon/helpIcon.html","<span class=\"fa-stack help-icon lo-accent-hover\" ng-mouseenter=\"showTooltip()\" ng-mouseleave=\"destroyTooltip()\">\n  <i class=\"fa fa-circle-thin fa-stack-2x\"></i>\n  <i class=\"fa fa-info fa-stack-1x\"></i>\n</span>");
$templateCache.put("liveops-config-panel-shared/directives/formFieldValidationMessage/formFieldValidationMessage.html","<div class=\"lo-error\" role=\"alert\"\n  ng-if=\'form[fieldName].$touched && form[fieldName].$invalid\'\n  ng-messages=\"form[fieldName].$error\">\n  <div ng-repeat=\"(error, value) in form[fieldName].$error\" >\n    <span ng-message=\"{{error}}\" ng-if=\"isString(value)\">{{value}}</span>\n    <span ng-message=\"{{error}}\" ng-if=\"value === true\">{{errorTypes[error]}}</span>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/loMultibox/loMultibox.html","<div ng-class=\"{\'edit\': showDrop === true}\">\n  <div class=\"label-container\" ng-click=\"labelClick()\" ng-hide=\"showDrop && !display\">\n    <input type=\"text\" name=\"{{name + \'-display\'}}\"\n      placeholder=\"{{\'multibox.add.placeholder\' | translate}}\"\n      readonly=\"true\" border=\"0\"  class=\"label\"\n      ng-required=\"true\"\n      ng-model=\"display\" />\n    <i class=\"fa\" ng-class=\"{\'fa-caret-down\': !showDrop, \'fa-caret-up\':showDrop}\"></i>\n  </div>\n\n  <div class=\"edit-box\" ng-show=\"showDrop\">\n    <type-ahead\n      items=\"items\"\n      placeholder=\"{{\'multibox.search.placeholder\' | translate}}\"\n      on-select=\"onSelect(selectedItem)\"\n      keep-expanded=\"true\"\n      selected-item=\"selectedItem\"></type-ahead>\n    <input id=\"show-create-new-item-btn\" class=\"btn\" type=\"button\"\n      ng-click=\"createItem()\" \n      value=\"{{\'multibox.create.btn\' | translate}}\" />\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/loTimePicker/loTimePicker.html","<div class=\"time-picker\">\n  <select ng-options=\"hour as hour.label for hour in hours\" \n    ng-model=\"selectedHour\"\n    ng-change=\"updateMinutesValue()\"></select>\n  \n  <span class=\"time-divider\">:</span>\n  \n  <select ng-options=\"minute as minute.label for minute in minutes\" \n    ng-model=\"selectedMinute\"\n    ng-change=\"updateMinutesValue()\"\n    ng-disabled=\"selectedHour.val == -1\"></select>\n  \n  <select ng-model=\"selectedHalf\"\n    ng-change=\"updateMinutesValue()\"\n    ng-disabled=\"selectedHour.val == -1\">\n      <option value=\"am\">AM</option>\n      <option value=\"pm\">PM</option>\n  </select>\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/loading/loading.html","<div class=\"loading\"><i class=\"fa fa-refresh fa-spin\"></i> {{\'loading\' | translate}}</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/modal/modal.html","<div id=\"modal\" ng-include=\"modalBody\">\n\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/numberSlider/numberSlider.html","<div class=\"number-slider inner-addon right\">\n  <input type=\"text\" ng-model=\"value\" placeholder=\"{{placeholder}}\"></input>\n  <i ng-mousedown=\"increment()\" class=\"fa fa-caret-up top\" ng-class=\"{disabled : value + 1 > maxValue}\"></i>\n  <i ng-mousedown=\"decrement()\" class=\"fa fa-caret-down bottom\" ng-class=\"{disabled : value - 1 < minValue}\"></i>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/resizeHandle/resizeHandle.html","<div class=\"resizable-handle lo-accent-text\"><i class=\"fa fa-ellipsis-v\"></i></div>");
$templateCache.put("liveops-config-panel-shared/directives/singleElementResizeHandle/singleElementResizeHandle.html","<div class=\"resizable-handle\"><i class=\"fa fa-ellipsis-v\"></i></div>");
$templateCache.put("liveops-config-panel-shared/directives/toggle/toggle.html","<label ng-show=\"trueValue && falseValue\" class=\"switch switch-green\" ng-switch on=\"confirmOnToggle\">\n  <input name=\"{{name}}\" ng-switch-when=\"true\" confirm-toggle type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-true-value=\"\'{{trueValue}}\'\" ng-false-value=\"\'{{falseValue}}\'\" ng-disabled=\"ngDisabled\">\n  <input name=\"{{name}}\" ng-switch-default type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-true-value=\"\'{{trueValue}}\'\" ng-false-value=\"\'{{falseValue}}\'\" ng-disabled=\"ngDisabled\">\n  <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n  <span class=\"switch-handle\"></span>\n</label>\n\n<label class=\"switch switch-green\" ng-show=\"!trueValue || !falseValue\" ng-switch on=\"confirmOnToggle\">\n  <input name=\"{{name}}\" ng-switch-when=\"true\" confirm-toggle type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-disabled=\"ngDisabled\">\n  <input name=\"{{name}}\" ng-switch-default type=\"checkbox\" class=\"switch-input\" ng-model=\"$parent.ngModel\" ng-disabled=\"ngDisabled\">\n  <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n  <span class=\"switch-handle\"></span>\n</label>");
$templateCache.put("liveops-config-panel-shared/directives/tooltip/tooltip.html","<div class=\"help-tooltip\"><div class=\"tooltip-content lo-accent-bg\" translate=\"{{translateValue}}\">{{text}}</div><div class=\"tooltip-arrow\"></div></div>");
$templateCache.put("liveops-config-panel-shared/directives/typeAhead/typeAhead.html","<div class=\"typeahead-container\">\n  <input\n    autocomplete=\"off\"\n    placeholder=\"{{placeholder}}\"\n    name=\"{{nameField}}\"\n    id=\"typeahead-container\"\n    type=\"text\"\n    ng-disabled=\"{{disabled}}\"\n    ng-model=\"currentText\"\n    ng-focus=\"showSuggestions=true\"\n    ng-blur=\"onBlur()\"></input>\n    <i class=\"fa fa-search\"></i>\n    <ul ng-show=\"filtered.length > 0 && (showSuggestions || hovering)\" \n      ng-mouseover=\"hovering=true\" \n      ng-mouseout=\"hovering=false\">\n       <li ng-repeat=\"item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)\"\n         ng-class=\"{\'highlight\' : highlightedItem == item, \'lo-highlight\' : highlightedItem == item}\"\n         class=\"lo-hover-highlight\"\n         ng-click=\"select(item)\" >\n           {{getDisplayString(item)}}\n       </li>\n    </ul>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/services/modal/confirmModal.html","\n<div class=\"confirm\">\n  <h3 class=\"header\">{{title}}</h3>\n  <p>{{message}}</p>\n  \n  <div class=\"footer\">\n    <a id=\"modal-cancel\" class=\"btn\" ng-click=\"cancelCallback()\">{{\'value.cancel\' | translate}}</a>\n    <a ng-click=\"okCallback()\" class=\"btn btn-primary\" id=\"modal-ok\">{{\'value.ok\' | translate}}</a>\n  </div>\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/editField/dropDown/editField_DropDown.html","<div class=\"edit-field edit-field-drop-down\" ng-init=\"edit = false\">\n  <ng-transclude></ng-transclude>\n  <div class=\"input-toggle\">\n\n    <select ng-model=\"ngModel\" ng-options=\"option for option in [\'Admin\', \'Agent\']\" name={{name}} required=\"\" ng-show=\"edit\" ng-change=\"saveHandler()\">\n      <option value=\"\">{{defaultText}}</option>\n    </select>\n\n    <div ng-mouseover=\"hover=true\" ng-mouseout=\"hover=false\" ng-click=\"edit = true\" title=\"Click to edit.\" ng-show=\"!edit\">\n      <label ng-show=\"ngModel\">{{ngModel}}</label>\n      <label class=\"placeholder\" ng-show=\"!ngModel\">Click to add value</label>\n      <i class=\"fa fa-pencil\" ng-show=\"hover\"></i>\n    </div>\n  </div>\n</div>");
$templateCache.put("liveops-config-panel-shared/directives/editField/input/editField_input.html","<div class=\"edit-field edit-field-input\" ng-init=\"edit = false\">\n  <label>{{label}}</label>\n  <div class=\"input-toggle\">\n    <input ng-model=\"ngModel\" name=\"{{name}}\" type=\"{{type ? type : \'text\'}}\" required=\"\" ng-show=\"edit\" ng-keyup=\"$event.keyCode == 13 ? saveHandler($event) : null\">\n    \n    <div ng-mouseover=\"hover=true\" ng-mouseout=\"hover=false\" ng-click=\"edit = true\" title=\"Click to edit.\" ng-show=\"!edit\">\n      <label ng-show=\"ngModel\">{{ngModel}}</label>\n      <label class=\"placeholder\" ng-show=\"!ngModel\">{{placeholder ? placeholder : \'Click to add value\'}}</label>\n      <i class=\"fa fa-pencil\" ng-show=\"hover\"></i>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/conditionGroup/conditionGroupEditor.html","<div ng-class=\"{\'input-group\': !cqe.readonly}\">\n  <label ng-show=\"!cqe.readonly || cqe.conditionGroup.conditions.length > 0\" ng-class=\"{\'has-elements\': cqe.conditionGroup.conditions.length > 0}\">\n    {{ cqe.sectionLabel }}\n  </label>\n\n  <div class=\"instant-add\" ng-show=\"!cqe.readonly\">\n    <div>\n      <type-ahead hover=\"true\" placeholder=\"{{ cqe.placeholderText }}\"\n        items=\"cqe.items\" selected-item=\"cqe.selectedItem\" filters=\"cqe.conditionsFilter\">\n      </type-ahead>\n\n      <proficiency-selector ng-show=\"cqe.selectedItem.hasProficiency\" operator=\"cqe.conditionOperator\" proficiency=\"cqe.conditionProficiency\"></proficiency-selector>\n    </div>\n\n    <button class=\"add btn\" type=\"button\"\n      ng-disabled=\"!cqe.selectedItem.id\" ng-click=\"cqe.addSelectedCondition()\">\n      <i class=\"fa fa-plus\"></i>\n    </button>\n  </div>\n\n  <div class=\"tag-wrapper clear\">\n    <div class=\"tag\" ng-repeat=\"condition in cqe.conditionGroup.conditions\">\n      {{cqe.getConditionName(condition) + \' \' + cqe.prettyConditionFilter(condition)}}\n      <a ng-show=\"!cqe.readonly\" ng-click=\"cqe.conditionGroup.removeCondition(condition)\"><i class=\"fa fa-times\"></i></a>\n    </div> \n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalation/escalationEditor.html","<ng-form name=\"ec.forms.timeAfterForm\">\n  <div class=\"input-group time-input\" ng-if=\"ec.minSecondsRequired > 0\">\n    <label>{{\'queues.query.builder.after.seconds\' | translate}}</label>\n    <div>\n      <input id=\"escalation-time-input\" ng-required=\"true\" name=\"amount\" type=\"number\" ng-model=\"ec.timeAmount\" ng-change=\"ec.updateTimeInSeconds()\" />\n      <select id=\"escalation-units-dropdown\" ng-model=\"ec.afterSecondsMultiplier\" ng-options=\"option.value as option.label for option in ec.afterTimeOptions\" ng-change=\"ec.updateMultiplier()\">\n      </select>\n      <form-error field=\"ec.forms.timeAfterForm.amount\"\n        error-type-required=\"Time in queue is required\"\n        error-type-min-time=\"Time in queue must be greater then the previous value\">\n      </form-error>\n    </div>\n  </div>\n</ng-form>\n\n<escalation-query-editor escalation-query=\"ec.escalation.query\"></escalation-query-editor>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalationList/escalationListEditor.html","<div class=\"divider-header first-header\">\n  <h4>{{\'value.details.query\' | translate}}</h4>\n  <a class=\"pull-right\">\n    <span id=\"show-advanced-query\" ng-show=\"!qlc.isAdvancedMode\" ng-click=\"qlc.advancedMode()\">\n      {{\'queue.details.version.query.advanced.link\' | translate}}\n    </span>\n    <span class=\"pull-right\"  id=\"show-basic-query\" ng-show=\"qlc.isAdvancedMode && qlc.initialAdvancedQuery\" ng-click=\"qlc.basicMode()\">\n      {{\'queue.details.version.query.basic.link\' | translate}}\n    </span>\n  </a>\n</div>\n\n\n<div class=\"input-group\" ng-if=\"qlc.isAdvancedMode\">\n  <label class=\"textarea-label\">{{\'value.details.query\' | translate}}</label>\n  <textarea id=\"advanced-query-field\"\n    ng-required=\"true\" type=\"text\" ng-model=\"qlc.advancedQuery\" name=\"query\"\n    ng-change=\"qlc.advancedQueryChanged()\"></textarea>\n   <form-error field=\"form[\'query\']\"\n     error-type-required=\"{{\'queue.details.queue.error\' | translate}}\"\n     error-type-zermelo=\"{{\'queue.query.build.zermelo.invalid\' | translate}}\"\n     error-type-api>\n   </form-error>\n</div>\n\n\n\n<div ng-if=\"!qlc.isAdvancedMode\" class=\"query-component\" ng-repeat=\"escalation in qlc.escalationList.escalations\">\n  <div ng-class=\"{\'detail-group\': $index !== 0 }\">\n    <div class=\"divider-header\" ng-if=\"$index !== 0\">\n      <h4 id=\"escalation-level-header\">{{ \'queue.query.escalation.level\' | translate:{level: $index} }}</h4>\n      <a id=\"remove-escalation-level\" class=\"pull-right\" ng-click=\"qlc.removeEscalation(escalation)\">{{ \'queue.query.escalation.level.remove\'| translate}}</a>\n    </div>\n\n    <escalation-editor\n      escalation=\"escalation\"\n      min-seconds=\"qlc.minSecondsForQuery($index)\"\n      previous-escalation=\"::qlc.escalationList.escalations[$index-1]\">\n    </escalation-editor>\n\n    <div >\n      <div class=\"divider-header\" ng-if=\"$index === 0\">\n        <h4>{{ \'queue.query.escalation\' | translate}}</h4>\n      </div>\n\n      <div ng-if=\"!qlc.escalationList.escalations[$index + 1]\" class=\"add-query detail-group\">\n        <h4 id=\"add-escalation-label\">{{ \'queue.query.add.escalation.level\' | translate:{level: ($index+1)} }}</h4>\n        <div class=\"add-group-button\">\n          <button class=\"add btn\" type=\"button\" ng-click=\"qlc.addEscalation()\">\n            <i id=\"add-escalation-btn\" class=\"fa fa-plus\"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/escalationQuery/escalationQueryEditor.html","\n<div class=\"input-group\" id=\"add-query-filter\">\n  <label>{{\'queues.query.builder.filters.label\' | translate}}</label>\n  <div class=\"instant-add add-filter\" disable-contents=\"eqc.possibleGroups.length == 0\">\n    <select id=\"select-filter-dropdown\"\n      ng-model=\"eqc.currentGroup\">\n      <option value=\"\" disabled>{{\'queues.query.builder.filters.placeholder\' | translate}}</option>\n      <option ng-repeat=\"key in eqc.possibleGroups\" value=\"{{key}}\">{{\'queues.query.builder.\' + key | translate }}</option>\n    </select>\n    <div class=\"add-group-button\">\n      <button class=\"add btn\" type=\"button\"\n        ng-disabled=\"!eqc.currentGroup\"\n        ng-click=\"eqc.addGroup(eqc.currentGroup)\">\n\n        <i id=\"add-filter-btn\" class=\"fa fa-plus\"></i>\n      </button>\n    </div>\n  </div>\n</div>\n\n\n<div ng-repeat=\"item in eqc.escalationQuery.groups\" class=\"details-group\">\n\n  <div class=\"query-component\">\n    <div class=\"divider-header\">\n      <h4>{{ \'queues.query.builder.\' + item.key + \'.title\' | translate }}</h4>\n      <a id=\"{{item.key}}-remove\" class=\"pull-right\" ng-click=\"eqc.verifyRemoveGroup(item.key)\">\n        {{\'queue.query.filter.remove\' | translate}}\n      </a>\n    </div>\n    <object-group-editor\n      object-group=\"item.objectGroup\"\n      key=\"item.key\">\n    </object-group-editor>\n  </div>\n\n</div>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/objectGroup/objectGroupEditor.html","<condition-group-editor\n  id=\"{{oge.key}}-all\"\n  ng-if=\"oge.key !== \':user-id\'\"\n  class=\"details-group\"\n  condition-group=\"oge.objectGroup.andConditions\"\n  items=\"oge.items\"\n  section-label=\"{{\'queue.query.builder.\' + oge.key + \'.all\' | translate}}\"\n  placeholder-text=\"{{ oge.placeholderText }}\"\n  readonly=\"oge.readonly\">\n</condition-group-editor>\n\n<condition-group-editor\n  id=\"{{oge.key}}-any\"\n  class=\"details-group\"\n  condition-group=\"oge.objectGroup.orConditions\"\n  items=\"oge.items\"\n  section-label=\"{{\'queue.query.builder.\' + oge.key + \'.some\' | translate}}\"\n  placeholder-text=\"{{ oge.placeholderText }}\"\n  readonly=\"oge.readonly\">\n</condition-group-editor>\n");
$templateCache.put("liveops-config-panel-shared/directives/queryEditor/proficiency/proficiencySelector.html","<div>\n  <select ng-model=\"operator\" class=\"pull-left proficiency-operator-dropdown\">\n    <option value=\">=\">{{ \'queue.query.builder.at.least\' | translate }}</option>\n    <option value=\"<=\">{{ \'queue.query.builder.at.most\' | translate }}</option>\n    <option value=\"=\">{{ \'queue.query.builder.exactly\' | translate }}</option>\n  </select>\n  <number-slider value=\"proficiency\"\n    min-value=\"1\" max-value=\"100\" class=\"proficiency-value pull-left\">\n  </number-slider>\n</div>\n");}]);
'use strict';

/**
  Taken from a stackoverflow.com post reply

  http://stackoverflow.com/a/25822878
**/

angular.module('liveopsConfigPanel.shared.directives')
  .directive('disableContents', [function() {
    /** disable-contents attribute directive
     * Set ng-disabled on certain child elements to equal the given expression
     * Child elements affected are input, button, select, textarea, and label
     * If a child element already has ng-disabled defined, the given expression is OR'd with the existing ng-disabled value
     */
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
    /** dropdown element directive
     * Generate a dropdown menu/list of items
     * 
     * Supported item config is as follows:
     * - id (string): Optional HTML ID to apply to the item's element
     * - onClick (function): Optional function triggered when the menu item is clicked
     * - stateLink (string): Optional state name to transition to when the menu item is clicked
     * - iconClass (string): Optional class for the icon displayed next to the menu item
     */
    return {
      scope : {
        items : '=', // (array) The list of configs for items to be shown in the menu.
        label : '@', // (string) The text of the menu's label/title
        displayPath: '@', // (string) The item property to be used as the label in the menu. Defaults to 'label'
        collapseIcon: '@', // (string) The class(es) applied to the icon shown when the menu is open. Defaults to 'fa fa-caret-up'
        expandIcon: '@', // (string) The class(es) applied to the icon shown when the menu is closed. Defaults to 'fa fa-caret-down'
        orderBy: '@', // (string) The item property to be used to sort the menu items. Defaults to 'label'
        hovering: '=?', // (boolean) Optional var to expose if the dropdown menu is being moused-over
        hoverTracker: '=?', // (array) Optional array used to track which dropdowns on the view are open
        showOnHover: '=?' // (boolean) Optional var to define if the menu should be shown when the label is hovered-over. Defaults to false
      },
      restrict: 'E',
      templateUrl : 'liveops-config-panel-shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element, attrs, controller) {
        scope.displayPath = scope.displayPath ? scope.displayPath : 'label';
        scope.collapseIcon = scope.collapseIcon ? scope.collapseIcon : 'fa fa-caret-up';
        scope.expandIcon = scope.expandIcon ? scope.expandIcon : 'fa fa-caret-down';
        scope.orderBy = scope.orderBy ? scope.orderBy : 'label';

        if (angular.isDefined(scope.hovering) && scope.hoverTracker){
          scope.hoverTracker.push(controller);
        }

        scope.clearOtherHovers = function(){
          angular.forEach(scope.hoverTracker, function(hoverCtrl){
            if (hoverCtrl !== controller){
              hoverCtrl.setShowDrop(false);
            }
          });
        };

        scope.optionClick = function(func){
          scope.showDrop = false;
          scope.hovering = false;
          
          if (angular.isFunction(func)){
            func();
          }
        };

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
    /** filter-dropdown element directive
     * Generate a dropdown menu with checkboxes to select/deselect items
     * 
     * Supported option config is as follows:
     * - checked (boolean): Optional boolean to set the initial checked state of the item. Defaults to true
     * 
     * An option item can also be a function that returns the display value when passed to the 'invoke' filter
     * 
     * Listen for 'dropdown:item:checked' event, thrown when a menu item is checked or unchecked
     */
    return {
      scope: {
        id: '@',
        options: '=', // (array) The list of config objects for items to be shown in the menu.
        valuePath: '@', // (string) The property path to be used as the checkbox's model for menu items. Defaults to 'value'
        displayPath: '@', // (string) The property path to be used as the label for menu items. Defaults to 'display'
        label: '@', // (string) The text of the menu's label/title
        showAll: '@', // (boolean) Whether to show the 'All' checkbox option
        orderBy: '@', // (string) The item property to be used to sort the menu items. Defaults to 'label'
        all: '=?' // (object) Exposes the 'All' checkbox option. all.checked reveals the 'All' checbox state
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
            checkAllByDefault = checkAllByDefault && (angular.isUndefined(option.checked) ? true : option.checked);
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
              option.checked = angular.isUndefined(option.checked) ? true : option.checked;
            });
          });
        }
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('formError', function() {
    /** form-error element directive
     * Display error messages for an invalid ng-form field
     * 
     * Define error messages by passing the translation key as an attribute like "error-type-[VALIDATION_KEY]"
     * E.g. set the message for a "required" validation error: error-type-required="my.required.key" 
     *      set the message for an "email" validation error: error-type-email="some.email.error.message"
     */
    return {
      restrict: 'E',
      templateUrl : 'liveops-config-panel-shared/directives/formError/formError.html',
      scope : {
        field : '=' // (object) The ng-form field object to show error messages for
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
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    /** help-icon element directive
     * Generate a icon that shows a tooltip when hovered
     */
    return {
      templateUrl : 'liveops-config-panel-shared/directives/helpIcon/helpIcon.html',
      restrict: 'E',
      scope : {
        text : '@', // (string) Optional text for the tooltip content
        translateValue: '@' // (string) Optional translation key for the tooltip content
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

/*
  formFieldValidationMessage is basically a clone of formError with a couple o
  key differences:
    - it "requires" a form up the DOM tree
    - it resolves the field based on fieldName
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
  .directive('loAudioControl', [function() {
    return {
      restrict: 'AE',
      controller: function() {
        var vm = this;
        
        vm.play = function() {
          vm.audioElement.play();
        };
        
        vm.pause = function() {
          vm.audioElement.pause();
        };
        
        vm.forward = function(seconds) {
          if(!angular.isNumber(seconds)) {
            seconds = 5;
          }
          vm.audioElement.currentTime = vm.audioElement.currentTime + seconds;
        };
        
        vm.rewind = function(seconds) {
          if(!angular.isNumber(seconds)) {
            seconds = 5;
          }
          vm.audioElement.currentTime = vm.audioElement.currentTime - seconds;
        };
      },
      link: function($scope, elem, attr, ctrl) {
        ctrl.audioElement = elem[0];
        if(attr.name) {
          $scope[attr.name] = ctrl;
        }
      }
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loDuplicateValidator', ['_', function(_) {
    /** lo-duplicate-validator attribute directive
     * Add a 'duplicate' validator to an ngModel to make sure the ngModel doesn't duplicate an existing item
     *
     * By default it will compare the ngModel value to the given list of items, marking the ngModel as invalid if it finds a match
     * Optionally supply a custom comparer function, which will be passed to lodash filter()
     */
    return {
      restrict : 'A',
      require: 'ngModel',
      scope: {
        loDuplicateValidatorItems: '=', // (array) List of items to compare the ngModel to
        loDuplicateValidatorOptions: '=' // (object) Optionally supply a custom comparator function by loDuplicateValidatorOptions.comparer
      },
      link: function ($scope, elem, attr, ngModelCtrl) {
        ngModelCtrl.$validators.duplicate = function (modelValue, viewValue) {
          var comparer = $scope.loDuplicateValidatorOptions.comparer || function(item) {
            return item === modelValue;
          };

          var obj = {
            modelValue: modelValue,
            viewValue: viewValue
          };

          return _.filter($scope.loDuplicateValidatorItems, comparer, obj).length === 0 ;
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loMultibox', [function(){
    /** lo-multibox element directive
     * A custom select-like element for liveopsResources, that also allows the user to create a new item
     *
     * Listen for ('resource:details:create:' + resourceName) to handle the create. The event passes selectedItem, and initialized createMode
     * Broadcast ('resource:details:' + resourceName + ':canceled') to tell the multibox that create has been canceled, and cancel createMode
     * Broadcast ('created:resource:' + resourceName) when loMultibox is in createMode to select the given resource
     */
    return {
      restrict: 'E',
      scope: {
        items: '=', // (array) The items used to populate the dropdown. Expected to be liveopsResources
        selectedItem: '=', // (object) The currently selected item. Will be null if nothing is selected
        resourceName: '@', // (string) The name of the liveopsResource used for this dropdown. Used when broadcasting events
        name: '@', // (string) The html name attribute for the element
        onItemSelect: '=' // (function) Optional function to execute when an item is selected
      },
      templateUrl: 'liveops-config-panel-shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {

        $scope.onSelect = function(selectedItem){
          if (angular.isString(selectedItem)){
            return; //User has typed a value into the typeahead that does not match an item. Ignore it.
          }

          $scope.display = selectedItem ? selectedItem.getDisplay() : null;

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
            $scope.$evalAsync(function(){
              var input = ele.find('type-ahead input');
              input.focus();
            });
          }
        };

        $scope.$watch('selectedItem', function(item) {
          if (angular.isString(item)){ //User has typed a value into the typeahead that does not match an item. Ignore it.
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
    /** lo-submit-spinner attribute directive
     * Show a loading spinner in place of the (button-tyled) element when the given expression is truthy
     */
    return {
      restrict: 'A',
      scope : {
        loSubmitSpinnerStatus: '&' // (expression) When true, the spinner is shown and the element is hidden. When false, spinner is hidden and element is shown
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
  .directive('loTimePicker', [function() {
    /** lo-time-picker element directive
     * An element for selecting times (without dates). Sets the given ngModel to the minute value of the selected time.
     * 
     * ngModel will be set to -1 when the user selects a time of "--". Otherwise, the time will be a value between 0 and 1440, inclusive.
     */
    return {
      templateUrl : 'liveops-config-panel-shared/directives/loTimePicker/loTimePicker.html',
      require: 'ngModel',
      scope : {
        ngModel : '='
      },
      restrict: 'E',
      link: function($scope){
        $scope.updateModel = function(newValue){
          $scope.ngModel = newValue;
        };

        $scope.init = function(){
          $scope.hours = [{
            minutes: -1,
            val: -1,
            label: '--'
          }];
          $scope.minutes = [];

          for (var i = 1; i < 13; i++){
            $scope.hours.push({
              minutes: 60 * i,
              label: '' + i,
              val: i
            });
          }

          for (var j = 0; j < 4; j++){
            var minutes = 15 * j;
            var label = (minutes < 10) ? '0' : '';

            $scope.minutes.push({
              minutes: minutes,
              label: label + minutes,
              val: j * 15
            });
          }
        };

        $scope.updateMinutesValue = function(){
          var minutesValue = $scope.selectedHour.minutes + $scope.selectedMinute.minutes;
          if ($scope.selectedHalf == 'pm'){
            minutesValue += 720;
          }

          if ($scope.selectedHour.val == 12){
            minutesValue -= 720;
          }
          
          if ($scope.selectedHour.val == -1){
            minutesValue = -1;
          }

          $scope.updateModel(minutesValue);
        };

        $scope.updateView = function(modelVal){
          //If -1, it's the default "closed" hours
          if (modelVal == -1){
            $scope.selectedHour = $scope.hours[0];
            $scope.selectedMinute = $scope.minutes[0];
            $scope.selectedHalf = 'am';
            return;
          }

          //Select whether it's morning or afternoon
          if (modelVal >= 720){
            $scope.selectedHalf = 'pm';
          } else {
            $scope.selectedHalf = 'am';
          }

          //Extract the selected minutes value
          var minutesValue = modelVal % 60;
          var minIndex = minutesValue / 15;
          $scope.selectedMinute = $scope.minutes[minIndex];

          //Extract the selected hour
          var hoursValue = modelVal - (minIndex * 15);
          var hoursIndex = hoursValue / 60;
          if (hoursIndex > 12){
            hoursIndex -= 12;
          }

          if (hoursIndex == 0){
            hoursIndex = 12;
          }

          $scope.selectedHour = $scope.hours[hoursIndex];
        };

        $scope.init();

        $scope.$watch('ngModel', function(newVal){
          $scope.updateView(newVal);
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
  /** modal element directive
   * A container for a modal
   * 
   * The value of modalBody on the $scope will be ng-included as the contents of the modal.
   * (Note that this directive does not have an isolated scope.)
   * You can use $compile to create a new modal with a specific scope and insert it into the document
   * See the modal service for an example
   */
  return {
    restrict: 'E',
    templateUrl : 'liveops-config-panel-shared/directives/modal/modal.html'
  };
}]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('namedTransclude', [
    function() {
      return {
        link: function($scope, element, attrs, controller, $transclude) {
          var innerScope = $scope.$parent.$parent.$new();
          
          $transclude(innerScope, function(clone) {
            element.empty();

            angular.forEach(clone, function(include) {
              if (include.attributes &&
                include.attributes.name &&
                include.attributes.name.value === attrs.name) {
                element.append(include);
              }
            });

            element.on('$destroy', function() {
              innerScope.$destroy();
            });
          });
        }
      };
    }
  ]);

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
  .directive('numberSlider', [function(){
    /** number-slider element directive
     * A number-spinner element for choosing a number
     */
    return {
      restrict: 'E',
      scope: {
        value: '=', // (int) The selected number
        minValue: '@', // (int) Optional minimum number that the user can select (inclusive)
        maxValue: '@', // (int) Optional maximum number that the user can select (inclusive)
        hasHandles: '=', // (boolean) Whether to show the increment and decrement buttons
        placeholder: '@', // (string) Optional placeholder text
        onChange: '&' // (expression) Optional expression to be executed when the value changes
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

            $scope.onChange($scope.value);
          }
        });

        $scope.increment = function () {
          if(angular.isUndefined($scope.value) || $scope.value === null){
            //If the element was only showing the placeholder, set the value
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.onChange();
            return;
          }

          if($scope.maxValue === null || $scope.value < $scope.maxValue){
            $scope.value = Number($scope.value) + 1;
            $scope.onChange();
          }
        };

        $scope.decrement = function () {
          if(angular.isUndefined($scope.value) || $scope.value === null){
           //If the element was only showing the placeholder, set the value
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.onChange();
            return;
          }

          if($scope.minValue === null || $scope.value > $scope.minValue){
            $scope.value = Number($scope.value) - 1;
            $scope.onChange();
          }
        };

        element.find('input').bind('keydown keypress', function(event){
          if(event.which === 40){ //Down arrow key
            $scope.$evalAsync($scope.decrement);
            event.preventDefault();
          } else if(event.which === 38){ //Up arrow key
            $scope.$evalAsync($scope.increment);
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
    /** resize-handle element directive
     * Create a resize grapple between two elements. Respects the css min-width sizes of the elements
     * 
     * Applies the 'two-col' class to an element that is larger than 700px
     * Applies the 'compact' class to an element that is smaller than 450px
     * 
     * Listen for the 'resizehandle:resize' which is fired when the elements are resized by the grapple
     */
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
    /** scroll-table attribute directive
     * Apply to a table element to display the table with a static header and a scrollable body
     * 
     * Set attribute max-height on the element to define the max height of the table body and enable the scrollbar.
     */
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
    /** seperate-validation attribute directive
     * Apply to a nested ng-form to prevent this form's inputs from affecting the parent form's valid state
     */
    return {
      restrict: 'A',
      require: 'form',
      link: function link($scope, element, iAttrs, formController) {
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
  .directive('utcDateConverter', ['$moment',
    function ($moment) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
          ngModel.$parsers.push(function(value) {
            if(!value) {
              return value;
            }
            
            return $moment.utc(value);
          });
          
          ngModel.$formatters.push(function(value) {
            if(!value) {
              return value;
            }
            
            return value.toDate();
          });
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('confirmToggle', ['Modal', '$q', 'Alert', function(Modal, $q, Alert) {
    /** confirm-toggle attribute directive
     * Add to a toggle directive to display a confirm modal when the toggle value is changed
     */
    return {
      restrict: 'A',
      require: ['ngModel', '^toggle'],
      link: function ($scope, $element, $attrs, controllers) {
        controllers[0].$parsers.push(function (newValue) {
          var oldValue = $scope.$parent.ngModel;
          
          $scope.$evalAsync(function(){ //For display until confirm dialog value is resolved
            $scope.$parent.ngModel = oldValue;
          });
          
          return $scope.onToggle(newValue, oldValue);
        });

        $scope.onToggle = function(newValue, oldValue){
          return Modal.showConfirm({
            message: (newValue === $scope.trueValue ? $scope.confirmEnableMessage : $scope.confirmDisableMessage)
          }).then(function(){
            $q.when($scope.onConfirm()).then(function(){
              Alert.success('Record updated');
              $scope.$parent.ngModel = newValue;
            }, function(error){
              Alert.error('Record failed to update.' + ' ' + error);
              $scope.$parent.ngModel = oldValue;
            }).finally(function(){
              controllers[0].$setPristine();
              controllers[0].$setUntouched();
            });
            return newValue;
          }, function(){
            return oldValue;
          });
        };
      }
    };
   }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('toggle', [function() {
    /** toggle element directive
     * Generate a two-state switch element
     */
    
    //TODO: move confirmEnableMessage, confirmDisableMessage, and onConfirm to confirmToggle
    return {
      templateUrl : 'liveops-config-panel-shared/directives/toggle/toggle.html',
      restrict: 'E',
      require: 'ngModel',
      scope : {
        ngModel : '=', // (ngModel) The model the toggle should be bound to
        ngDisabled : '=', // (expression) Whether the toggle should be disabled
        name: '@', // (string) HTML name attribute for the element
        trueValue: '@', // (string/primitive) Value for the model when the toggle is switched on. Default is boolean true
        falseValue: '@', // (string/primitive) Value for the model when the toggle is switched off. Default is boolean false
        confirmEnableMessage: '@', // (string) Optional translation key for the confirm message shown when toggling on
        confirmDisableMessage: '@', // (string) Optional translation key for the confirm message shown when toggling off
        onConfirm: '&' // (expression) Optional expression to execute when the user confirms the toggle. If user cancels, nothing happens.
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
    /** tooltip element directive
     * Generate a tooltip attached to the given element. 
     * Tooltip orientation is automatically chosen based on the element's proximity to page edges
     */
    return {
      templateUrl: 'liveops-config-panel-shared/directives/tooltip/tooltip.html',
      restrict: 'E',
      scope: {
        text: '@', // (string) Optional tooltip content
        target: '=', // (element) The element to attach the tooltip to
        translateValue: '@' // (string) Optional translation key for the tooltip content
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

        //Must use timeout here; evalAsync happens too early?
        $timeout($scope.setPosition, 1);
      }
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .filter('trusted', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
    /** type-ahead element directive
     * Create an input element that shows suggestions as you type
     * 
     * Default comparator compares the entered text with the items' getDisplay() result, ignoring case
     */
  .directive('typeAhead', ['$filter', '$parse', function($filter, $parse) {
    return {
      restrict: 'E',
      require: '?^form',
      scope : {
        items: '=', // (array) The items to search for matches
        nameField: '@', // (string) HTML name. Also used as the display property path on the items if given items have no getDisplay function
        onSelect: '&', // (expression) Optional expression invoked when an item is selected. Receives selectedItem as object if text matches one of the items, or the search text if there is no item match
        placeholder: '@', // (string) Optional placeholder text
        prefill: '=', // (string) Optional pre-entered search text. Defaults to ''
        keepExpanded: '=', // (boolean) Whether to keep the dropdown expanded when focus is lost. Defaults to false
        onEnter: '&', // (expression) Optional expression invoked when the enter key is pressed while the element is focused. Receives item as object if an item was selected, or the search text if there is no item match
        filters: '=?', // (expression or array) Optional filter function or list of filters used to determine matching items
        selectedItem: '=?', // (object) Exposes the selectedItem
        disabled: '@' // (boolean) Whether the element is disabled
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
          $scope.onSelect({selectedItem: newVal});
          if (newVal === null){
            $scope.currentText = '';
          } else if ($scope.getDisplayString(newVal) !== $scope.currentText){
            //If selectedItem is updated externally, update the search text
            $scope.currentText = $scope.getDisplayString(newVal);
          }
        });

        $scope.$watch('items', function(items) {
          if (angular.isDefined(items)){
            $scope.updateHighlight();
          }
        }, true);

        $scope.select = function(item) {
          $scope.selectedItem = item;
          
          if (! angular.isString(item)){
            $scope.currentText = $scope.getDisplayString(item);
          }
          
          if ($scope.form) {
            var ngModel = $parse($scope.nameField)($scope.form);
            ngModel.$setDirty();
            ngModel.$setTouched();
          }
          
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

        $scope.getDisplayString = function(item){
          if (angular.isFunction(item.getDisplay)){
            return item.getDisplay();
          } else if (angular.isDefined(item[$scope.nameField])){
            return item[$scope.nameField];
          } else {
            return item;
          }
        };
      },
      link: function($scope, element, attr, form) {
        if(form) {
          $scope.form = form;
        }
        
        element.find('input').bind('keydown keypress', function(event){
          var highlightedIndex;

          if (event.which === 13) { //Enter key
            $scope.$evalAsync(function(){
              var selected = $scope.highlightedItem ? $scope.highlightedItem : $scope.currentText;
              $scope.select(selected);
              $scope.onEnter({item: selected});
            });

            event.preventDefault();
          } else if(event.which === 40){ //Down arrow key
           highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex + 1 < $scope.filtered.length){
              $scope.$evalAsync(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex + 1];

                var li = element.find('li:nth-child(' + (highlightedIndex + 2) + ')');
                $scope.showListElement(li);
              });
            }
          } else if(event.which === 38){ //Up arrow key
            highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex - 1 >= 0){
              $scope.$evalAsync(function(){
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
    /** uuid attribute directive
     * Add a uuid validator to an ngModel. Verifies that an ngModel is a valid UUID
     */
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ctrl) {
        ctrl.$validators.uuid = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid - required will catch it if it's not
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
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('keysCount', [function () {
    /** keysCount filter
     * Accepts an object
     * Returns the number of properties/keys in the object
     */
    return function (obj) {
      return Object.keys(obj).length;
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('matchesField', ['$filter', function ($filter) {
    /** matchesField filter
     * Accepts an objectg, a string representing the property path, and the value to match
     * If the item's property matches the value, returns the item
     * If no match, returns undefined.
     * 
     * Allows matching/search through arrays; use colons in fieldPath to separate layers
     * e.g. "skills:id" will search an object like {name: "name", skills: [{id: "id"}, {id: "other"}]}
     */
    return function (item, fieldPath, value) {
      var findFields = function (item, fieldPath, value) {
        if (angular.isUndefined(item) || angular.isUndefined(fieldPath) || fieldPath === '' || angular.isUndefined(value)){
          return;
        }

        var firstColonIndex = fieldPath.indexOf(':');
        //If there are colons still in the field path, we recurse with the next level
        if (firstColonIndex > -1){
          var currentPath = fieldPath.substring(0, firstColonIndex);
          var remainingPath = fieldPath.substring(firstColonIndex + 1);
          
          return findFields(item[currentPath], remainingPath, value) ? item : undefined;
        }

        //The field path has no more colons in it, and our item is an array, check the array item properties
        if (angular.isArray(item)) {
          for (var i = 0; i < item.length; i++){
            if (item[i][fieldPath] === value){
              return item;
            }
          }
        } else { //Otherwise, check the item properties
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
    /** objectNegation filter
     * Accepts two sets of arrays and field names
     * Returns all items from the first array that do not have a 'field' property matching the 'otherField' values from the second array
     */
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
    /** search filter
     * Accepts an array of items, an array of fields to check for matches, and a string search text
     * Returns a list of items that have at least one property from the list of fields that contain the search text
     * Returns the original list of items if fields or query are falsy
     * 
     * Matches ignore special characters and are case-insensitive
     */
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
    /** selectedOptions filter
     * Accepts an array of items and a field configuration object
     * Returns a list of items whose field property matches at least one of the 'checked' options value
     *
     * Field configuration object supports the following properties
     * - name (string) The path of the property to match. Passed to matchesField filter
     * - options (array of objects)
     *     - value (any) The value to match against
     *     - checked (boolean) Whether this field value is selected and should be matched against
     */
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
    /** selectedTableOptions filter
     * Accepts an array of items and an array of field configuration objects
     * Returns a list of items that match at least one selected field option for each field type
     * Returns an empty array if items is undefined
     * 
     * Uses the selectedOptions filter to determine if an item matches a field
     * 
     * Ignores field configuration objects that:
     *  - have a falsy 'checked' value
     *  - do not have a 'header.options' property
     *  - have a 'header.options' property of length 0
     *  - have a truthy 'header.all.checked' property
     */
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

          //If this filter doesn't have options, skip it
          if (!$parse('header.options')(field)) {
            continue;
          }

          //If the 'All' option is checked, don't filter anything out for this field
          if (field.header.all && field.header.all.checked){
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

angular.module('liveopsConfigPanel.shared.filters')
  .filter('localToUtcDate', ['$moment', function ($moment) {
      return function (date) {
        if(!date) {
          return date;
        }
        
        return $moment.utc(date);
      };
    }
]);


'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('minutesToTime', ['$moment', function ($moment) {
      return function (minutes) {
        if(!angular.isNumber(minutes) || minutes < 0) {
          return null;
        }
        
        var newDate = $moment();
        newDate.hours(0);
        newDate.minutes(minutes);

        return newDate.format('HH:mm');
      };
    }
]);

'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('moment', ['$moment', function ($moment) {
    return function (dateString, format) {
      return $moment(dateString).format(format);
    };
  }]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Alert', ['toastr', '$window', function (toastr, $window) {
    /** alert service
     * Display popup notices on the screen
     */
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
    /** DirtyForms service
     * Register forms on the page and track their $dirty property
     * Used to show a confirm message when user takes an action that would discard edits they have made to a form
     */
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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
   /** emitInterceptor http interceptor service
    * Add as an interceptor to a liveopsResource to broadcast events based on the http response
    */
  .service('emitInterceptor', ['$rootScope', '$q', '$location', 'apiHostname', 'emitErrorInterceptor',
    function ($rootScope, $q, $location, apiHostname, emitErrorInterceptor) {
      this.response = function (response) {
        var path = response.config.url.replace(apiHostname + '/v1', '');
        var eventPath = path.replace(/\//g, ':');
        
        var proto = Object.getPrototypeOf(response.resource);
        
        if(response.status === 201){
          $rootScope.$broadcast('created:resource', response.resource);
          $rootScope.$broadcast('created:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('created:resource' + eventPath, response.resource);
        } else if(response.status === 200) {
          eventPath = eventPath.replace(/:[-\w]+$/, '');
          $rootScope.$broadcast('updated:resource', response.resource);
          $rootScope.$broadcast('updated:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('updated:resource' + eventPath, response.resource);
        }

        return response.resource;
      };
      
      this.responseError = emitErrorInterceptor.responseError;
    }
  ])
  /** emitErrorInterceptor http interceptor service
    * Add as an interceptor to a liveopsResource to broadcast events based on error http response
    */
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
  /** Modal service
   * Create modal elements on demand and handle inserting them into the page
   */
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
  .service('modelResetService', [function () {
    this.reset = function reset(model) {
      if(!model.$original) {
        throw new Error('Model does not support reset');
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
    .factory('ZermeloEscalationQuery', ['_', 'jsedn', 'ZermeloObjectGroup', 'Skill', 'Group', 'TenantUser',
      function (_, jsedn, ZermeloObjectGroup, Skill, Group, TenantUser) {

        function EscalationQuery() {
          this.groups = [];
        }

        EscalationQuery.KEY_OBJECTS = {
          ':skills'  : Skill,
          ':groups'  : Group,
          ':user-id' : TenantUser
        };

        EscalationQuery.ALLOWED_KEYS = _.keys(EscalationQuery.KEY_OBJECTS);

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
              if (!_.includes(EscalationQuery.ALLOWED_KEYS, key.val)) {
                throw 'group key must be in ' + angular.toJson(EscalationQuery.ALLOWED_KEYS);
              }

              eq.setGroup(key.val, ZermeloObjectGroup.fromEdn(val));
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

        var ALLOWED_KEYS = [':groups', ':skills', ':id'];

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
          return !_.includes(vm.conditionGroup.getConditionIdentifiers(), item.id) && (item.active || !angular.isDefined(item.active));
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
      vm.previousEscalation = $scope.previousEscalation;

      if(vm.escalation.afterSecondsInQueue) {
        vm.afterSecondsMultiplier = vm.escalation.afterSecondsInQueue % 60 === 0 ? 60 : 1;
        vm.afterTimeInQueue = vm.escalation.afterSecondsInQueue / vm.afterTimeMultiplier;
      };

      $scope.$watch('previousEscalation.afterSecondsInQueue', function () {
        vm.checkMinValue();
      });

      vm.checkMinValue = function () {
        if(vm.escalation && vm.forms.timeAfterForm && vm.forms.timeAfterForm.amount) {
          var validity = vm.previousEscalation.afterSecondsInQueue < vm.escalation.afterSecondsInQueue;
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
          $scope.queryString = vm.advancedQuery;
          var ednQuery = ZermeloEscalationList.fromEdn($scope.queryString);

          if(ednQuery) {
            if(!vm.initialAdvancedQuery ) {
              vm.initialAdvancedQuery = ednQuery;
            }
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
          queryString: '=',
          form: '='
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
    .controller('ObjectGroupEditorController', ['$scope', '$translate', 'Session', 'Skill', 'Group', 'TenantUser', 'ZermeloEscalationQuery',
      function ($scope, $translate, Session, Skill, Group, TenantUser, ZermeloEscalationQuery) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
      vm.readonly = $scope.readonly;
      vm.modelType = ZermeloEscalationQuery.KEY_OBJECTS[vm.key]; 
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
    /** validate-count attribute directive
     * Add a validateCount validator to an ngModel. Verifies that the model is a non-empty array.
     */
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

angular.module('liveopsConfigPanel.shared.services')
  .factory('Timezone', ['$resource', '$http', 'apiHostname', 'resultTransformer',
    function ($resource, $http, apiHostname, resultTransformer) {
      var Timezone = $resource(apiHostname + '/v1/timezones', {}, {
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

      Timezone.prototype.getDisplay = function () {
        return '(' + this.offset + ') ' + this.timezone;
      };

      return Timezone;
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
  .factory('Tenant', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, queryCache, cacheAddInterceptor) {

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
        }, {
          name: 'timezone'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('User', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'userUpdateTransformer',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, userUpdateTransformer) {
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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('BusinessHour', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'businessHourInterceptor', 'businessHourQueryInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, businessHourInterceptor, businessHourQueryInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:id',
        resourceName: 'BusinessHour',
        updateFields: [{
          name: 'name'
        }, {
          name: 'active'
        }, {
          name: 'description',
          optional: true
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
        getInterceptor: [businessHourInterceptor, emitErrorInterceptor],
        queryInterceptor: [businessHourQueryInterceptor, emitErrorInterceptor],
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
  .factory('DispatchMapping', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('Flow', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

      var Flow = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:id',
        resourceName: 'Flow',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion',
          optional: true
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'type'
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('Group', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: [emitInterceptor]
      });

      Group.prototype.getDisplay = function () {
        return this.name;
      };

      return Group;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
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
  .factory('RealtimeStatisticInteraction', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var RealtimeStatisticInteraction = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/realtime-statistics/interactions',
        resourceName: 'RealtimeStatisticInteraction'
      });

      return RealtimeStatisticInteraction;
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Recording', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var Recording = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/interactions/:interactionId/recordings/:id',
        resourceName: 'Recording'
      });

      Recording.prototype.getDisplay = function () {
        return this.name;
      };

      return Recording;
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
      'tenantId': 'tenant-id',
      'listTypeId': 'listTypeId1',
      'items': [{
        'field1': 'string value',
        'field2': 33,
        'field3': true
      }]
    }), new List({
      'id': 'listId2',
      'tenantId': 'tenant-id',
      'listTypeId': 'listTypeId2'
    }), new List({
      'id': 'listId3',
      'tenantId': 'tenant-id',
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
  .factory('List', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'queryCache', 'cacheAddInterceptor', 'itemBackupInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, queryCache, cacheAddInterceptor, itemBackupInterceptor) {

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
        getInterceptor: [itemBackupInterceptor, emitErrorInterceptor],
        queryInterceptor: [itemBackupInterceptor, emitErrorInterceptor],
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
  .factory('ListType', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'queryCache', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, queryCache, cacheAddInterceptor) {

      var List = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/list-types/:id',
        resourceName: 'ListType',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('Media', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
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
  .factory('MediaCollection', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor', 'mediaCollectionMapCleanTransformer',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor, mediaCollectionMapCleanTransformer) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        putRequestTransformer: mediaCollectionMapCleanTransformer
      });

      return MediaCollection;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Queue', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('PlatformPermission', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      var PlatformPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/permissions/:id',
        resourceName: 'PlatformPermission',
        updateFields: [],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

      PlatformPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return PlatformPermission;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('PlatformRole', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
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
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
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
  .factory('TenantPermission', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      var TenantPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/permissions/:id',
        resourceName: 'TenantPermission',
        updateFields: [],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

      TenantPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return TenantPermission;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantRole', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function(LiveopsResourceFactory, apiHostname, Session, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitErrorInterceptor
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
  .factory('Skill', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {
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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUser', ['LiveopsResourceFactory', 'apiHostname', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, tenantUserInterceptor, tenantUserQueryInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

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
        }, {
          name: 'activeExtension',
          optional: true
        }],
        putRequestTransformer: tenantUserStatusUpdateTransformer,
        postRequestTransformer: tenantUserStatusUpdateTransformer,
        getInterceptor: [tenantUserInterceptor, emitErrorInterceptor],
        queryInterceptor: [tenantUserQueryInterceptor, emitErrorInterceptor],
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
  .factory('BusinessHourException', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:businessHourId/exceptions/:id',
        resourceName: 'BusinessHourException',
        updateFields: [{
          name: 'date'
        }, {
          name: 'isAllDay'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('FlowDraft', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', '$http',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, $http) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('FlowVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('QueueVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
  .factory('TenantGroupUsers', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {
      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:groupId/users/:memberId',
        resourceName: 'TenantGroupUser',
        requestUrlFields: {
          tenantId: '@tenantId',
          groupId: '@groupId',
          memberId: '@memberId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:memberId/groups',
        resourceName: 'TenantUserGroup',
        requestUrlFields: {
          tenantId: '@tenantId',
          memberId: '@memberId'
        },
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
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
  .factory('TenantSkillUser', ['LiveopsResourceFactory', 'apiHostname', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitErrorInterceptor) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser',
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor
      });

    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('TenantUserSkill', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'userSkillCacheRemoveInterceptor', 'setSkillNameInterceptor', 'removeDefaultProficiencyInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, userSkillCacheRemoveInterceptor, setSkillNameInterceptor, removeDefaultProficiencyInterceptor) {

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
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
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
