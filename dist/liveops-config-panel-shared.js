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
  angular.module('liveopsConfigPanel.shared.services', []);
  angular.module('liveopsConfigPanel.shared',
      [
          'liveopsConfigPanel.shared.config',
          'liveopsConfigPanel.shared.directives',
          'liveopsConfigPanel.shared.filters',
          'liveopsConfigPanel.shared.services',
          'ngResource'
      ]);

})(angular);

'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', '$injector', 'Session', 'apiHostname',
    function ($q, $injector, Session, apiHostname) {

      var Interceptor = function () {

        this.request = function (request) {
          if (request.url.indexOf(apiHostname) >= 0 && Session.token) {
            if (Session.token && Session.token.indexOf('Token') >= 0){ //Don't prepend Basic if we're using an API session token
              request.headers.Authorization = Session.token;
            } else {
              request.headers.Authorization = 'Basic ' + Session.token;
            }
          }

          return request;
        };

        this.responseError = function (response) {
          if (Session.token && Session.token.indexOf('Token') >= 0){ //If an invite token is invalid, remove the token so the invalid auth header isn't used again
            Session.setToken(null);
          }
          
          return $q.reject(response);
        };
      };

      return new Interceptor();
    }
  ])
  .config(function ($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
  });

'use strict';

describe('AuthInterceptor', function() {

  var $scope, $httpProviderIt, $httpBackend, AuthInterceptor, Session, hostname;

    beforeEach(module('liveopsConfigPanel', function($httpProvider){
      $httpProviderIt = $httpProvider;
    }));

    beforeEach(inject(['$rootScope', '$httpBackend', 'AuthInterceptor', 'Session', 'apiHostname',
        function(_$rootScope_, _$httpBackend_, _AuthInterceptor_, _Session_, _hostname_) {

      hostname = _hostname_;
      $scope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      AuthInterceptor = _AuthInterceptor_;
      Session = _Session_;
    }]));

    it('should be registered as an interceptor', function () {
        expect($httpProviderIt.interceptors).toContain('AuthInterceptor');
    });

    it('should add the authorization header when the request URL and token are set and correct', function () {
      Session.token = 'abc123';

      var config = AuthInterceptor.request({ url : hostname + '/v1/users', headers: {} });

      expect(config.headers.Authorization).toBe('Basic ' + Session.token);
    });

    it('should not add the authorization header when the request URL is not valid', function () {
      Session.token = 'abc123';

      var config = AuthInterceptor.request({ url : 'http://google.com', headers: {} });

      expect(config.headers.Authorization).not.toBeDefined();
    });

    it('should not add the authorization header when the token is not valid', function () {
      Session.token = '';

      var config = AuthInterceptor.request({ url : hostname + '/v1/users', headers: {} });

      expect(config.headers.Authorization).not.toBeDefined();
    });
});
'use strict';

/* global  window: false */

angular.module('liveopsConfigPanel')
  .service('AuthService', ['$resource', '$http', '$q', 'Session', 'apiHostname', 'User', '$state',
    function ($resource, $http, $q, Session, apiHostname, User, $state) {

      var self = this;

      // localStorage should not be used to store passwords in production
      // this is a temporary solution until Tao gets back to me on the ability to get
      // a token back from the API to store instead.

      // if this is NOT possible, we will need to setup a slim backend server to manage
      // session information using redis or memcache

      // this will suffice in beta however.
      this.login = function (username, password) {
        Session.token = null; //Destroy any previous token so that the AuthInterceptor doesn't trigger
        var token = this.generateToken(username, password);
        var request = this.fetchUserInfo(token);

        return request.then(function(response) {
          var user = new User({
            id: response.data.result.userId,
            email: response.data.result.username,
            firstName: response.data.result.firstName,
            lastName: response.data.result.lastName
          });
          
          var tenants = response.data.result.tenants;
          var platformPermissions = response.data.result.platformPermissions;
          
          Session.set(user, tenants, token, platformPermissions);

          return response;
        }, function(response) {
          return $q.reject(response);
        });
      };

      this.refreshTenants = function () {
        return self.fetchUserInfo(Session.token).then( function (response ) {
          Session.setTenants(response.data.result.tenants);
        });
      };

      this.logout = function () {
        Session.destroy();
        $state.transitionTo('login');
      };

      this.fetchUserInfo = function (token) {
        return $http.post(apiHostname + '/v1/login', {}, {
          headers: {
            Authorization: 'Basic ' + token
          }
        });
      };

      this.generateToken = function (username, password) {
        return window.btoa(username + ':' + password);
      };
    }
  ]);

'use strict';

/* global spyOn: false  */

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';
var USERNAME = 'titan@liveops.com';
var PASSWORD = 'gKVnfF9wrs6XPSYs';
var TENANTS = [
  {
    tenantId: 1,
    name: 'test1',
    tenantPermissions: []
  },
  {
    tenantId: 2,
    name: 'test2',
    tenantPermissions: []
  }
];
var platformPermissions = [];

var LOGIN_RESPONSE;

describe('AuthService', function () {
  var $scope, $location, $httpBackend, AuthService, Session, apiHostname;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  
  beforeEach(inject(['$rootScope', '$location', '$httpBackend', 'AuthService', 'Session', 'apiHostname', 'mockUsers',
    function (_$rootScope_, _$location_, _$httpBackend_, _AuthService_, _Session_, _apiHostname_, mockUsers) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      
      LOGIN_RESPONSE = {
        result : {
          userId: mockUsers[0].id,
          username: mockUsers[0].email,
          tenants: TENANTS,
          platformPermissions: platformPermissions
        }
      };
    }
  ]));

  it('should have a method get an authentication token', function () {
    var token = AuthService.generateToken(USERNAME, PASSWORD);
    expect(token).toBe(TOKEN);
  });

  it('should have a method to logout which destroys the session', function () {
    AuthService.logout();
    expect(Session.token).toBeNull();
  });

  describe('ON login', function() {
    it('should set the session when successful', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        jasmine.any(Object), TENANTS, AuthService.generateToken(USERNAME, PASSWORD), platformPermissions);
    });


    it('should validate on failure', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(500, '');

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).not.toHaveBeenCalled();
      expect(Session.token).toBeNull();
    });
  });
  
  describe('refreshTenants function', function() {
    it('should set the tenants', inject([function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);
      spyOn(Session, 'setTenants');
      
      AuthService.refreshTenants();
      $httpBackend.flush();
      expect(Session.setTenants).toHaveBeenCalledWith(TENANTS);
    }]));
  });
});

'use strict';
// this function runs once, and only once, to wire up the route
// blocking and redirecting.

// this also wires up the isLoggedIn flag to the rootScope so
// all controllers, directives, etc can see it.

angular.module('liveopsConfigPanel')
  .run(['$rootScope', '$state', 'Session',
    function ($rootScope, $state, Session) {
      $rootScope.$on('$stateChangeStart', function (event, next) {

        if(next.isPublic || Session.isAuthenticated()){
          return;
        }

        event.preventDefault();
        $state.go('login');
      });
    }
  ]);

'use strict';

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('routeSecurity', function () {
  var $scope, $state, $injector, AuthService, Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$state', '$injector', 'AuthService', 'Session', '$httpBackend', 'apiHostname',
    function (_$rootScope_, _$state, _$injector_, _AuthService_, _Session_, $httpBackend, apiHostname) {
      $scope = _$rootScope_.$new();
      $state = _$state;
      $injector = _$injector_;
      AuthService = _AuthService_;
      Session = _Session_;

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});
    }
  ]));


  describe('user is AUTHENTICATED', function () {
    beforeEach(function() {
      Session.token = TOKEN;
    });


    it('should setup route interception and allow access to secure routes', inject(function ($rootScope) {

      Session.token = 'abc';

      $state.go('content.management.users').then(function () {
        var event = $rootScope.$broadcast('$stateChangeStart', {
        });

        expect(event.defaultPrevented).toBeFalsy();
        expect($state.current.name).toBe('content.management.users');

      });
      $scope.$apply();
    }));

  });

  describe('user is NOT AUTHENTICATED', function () {
    it('should setup route interception and prevent access to secure routes', inject(function ($rootScope) {
      $state.go('content.management.users');

      Session.token = null;

      var event = $rootScope.$broadcast('$stateChangeStart', {
      });

      $scope.$apply();

      expect(event.defaultPrevented).toBeTruthy();
      expect($state.current.name).toBe('login');
    }));

    it('should setup route interception and allow access to unsecure routes when not authenticated', inject(function ($rootScope) {
      var event = $rootScope.$broadcast('$stateChangeStart', {
        isPublic: true
      });

      expect(event.defaultPrevented).toBeFalsy();
    }));
  });
});

'use strict';

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel')
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

/* global localStorage: false */

var USER;

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('Session', function() {
  var $scope, session;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$rootScope','Session', 'User', function(_$rootScope_, _session_, User) {
    $scope = _$rootScope_.$new();
    session = _session_;
    
    USER = new User({
      'role': 'admin',
      'email': 'titan@liveops.com',
      'createdBy': '00000000-0000-0000-0000-000000000000',
      'displayName': 'titan',
      'updated': '2015-06-02T08:29:03Z',
      'firstName': 'titan',
      'created': '2015-06-02T08:29:03Z',
      'state': null,
      'extension': null,
      'externalId': null,
      'updatedBy': '00000000-0000-0000-0000-000000000000',
      'status': 'enabled',
      'id': '6d094710-0901-11e5-87f2-b1d420920055',
      'lastName': 'user'
    });
  }]));

  it('should have a method to set the session information', function() {
    session.set(USER, [], TOKEN);

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.getDisplay());
    expect(session.isAuthenticated()).toBeTruthy(true);

    var stringifiedSession = localStorage.getItem(session.userSessionKey);
    expect(stringifiedSession).toBeDefined();
  });


  it('should have a method to destroy the session information', function() {
    session.set(USER, [], TOKEN);

    session.destroy();

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();
    expect(localStorage.getItem(session.userSessionKey)).toBe(null);
  });


  it('should have a method to restore the session information', function() {
    session.set(USER, [], TOKEN);

    session.token = null;
    session.user = null;

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();

    session.restore();

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.getDisplay());
    expect(session.isAuthenticated()).toBeTruthy();
  });
});

'use strict';

angular.module('liveopsConfigPanel')
  .service('UserPermissions', ['Session', '$state', '$q', '$timeout', function (Session, $state, $q, $timeout) {
      var self = this;
    
      this.hasPermission = function(permissionKey){
        if (! Session.isAuthenticated()){
          return false;
        }
        
        var permissions = [];
        permissions.push.apply(permissions, Session.platformPermissions);
        permissions.push.apply(permissions, Session.tenant.tenantPermissions);
        
        for (var i = 0; i < permissions.length; i++){
          if (permissions[i] === permissionKey){
            return true;
          }
        }
        
        return false;
      };
      
      this.hasPermissionInList = function(permissionList){
        for (var i = 0; i < permissionList.length; i++){
          if (this.hasPermission(permissionList[i])){
            return true;
          }
        }
        
        return false;
      };
      
      this.resolvePermissions = function(permissionList){
        var deferred = $q.defer();
        
        $timeout(function(){
          if (! self.hasPermissionInList(permissionList)){
            $state.go('content.userprofile', {
              messageKey: 'permissions.unauthorized.message'
            }); 
            deferred.reject();
          } else {
            deferred.resolve();
          }
        });
        
        return deferred.promise;
      };
    }
  ]);

'use strict';

/* global spyOn: false  */

describe('UserPermissions Service', function () {
  var UserPermissions,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  
  beforeEach(inject(['UserPermissions', 'Session', function (_UserPermissions, _Session) {
      UserPermissions = _UserPermissions;
      Session = _Session;
  }]));

  describe('hasPermission function', function(){
    it ('should exist', function(){
      expect(UserPermissions.hasPermission).toBeDefined();
      expect(UserPermissions.hasPermission).toEqual(jasmine.any(Function));
    });
    
    it ('should return true if the given permission is in the Sessions platform permissions list', function(){
      Session.platformPermissions = ['permission1', 'permission2', 'permission3'];
      Session.tenant.tenantPermissions = [];
      
      var result = UserPermissions.hasPermission('permission2');
      expect(result).toBeTruthy();
    });
    
    it ('should return true if the given permission is in the selected tenants tenant permissions list', function(){
      Session.platformPermissions = [];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermission('permission2');
      expect(result).toBeTruthy();
    });
    
    it ('should return false if the given permission is not in either list', function(){
      Session.platformPermissions = ['permission5', 'permission6'];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermission('SOME_OTHER_PERMISSION');
      expect(result).toBeFalsy();
    });
  });
  
  describe('hasPermissionInList function', function(){
    it ('should exist', function(){
      expect(UserPermissions.hasPermissionInList).toBeDefined();
      expect(UserPermissions.hasPermissionInList).toEqual(jasmine.any(Function));
    });
    
    it ('should return true if one of the given permission is in the Sessions platform permissions list', function(){
      Session.platformPermissions = ['permission1', 'permission2', 'permission3'];
      Session.tenant.tenantPermissions = [];
      
      var result = UserPermissions.hasPermissionInList(['anotherPermission', 'permission2', 'somethinglese']);
      expect(result).toBeTruthy();
    });
    
    it ('should return true if the given permission is in the selected tenants tenant permissions list', function(){
      Session.platformPermissions = [];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermissionInList(['anotherPermission', 'permission2', 'permission3']);
      expect(result).toBeTruthy();
    });
    
    it ('should return false if none of the given permission is not in either list', function(){
      Session.platformPermissions = ['permission5', 'permission6'];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermissionInList(['SOME_OTHER_PERMISSION', 'NOT_A_PERMISSION']);
      expect(result).toBeFalsy();
    });
  });
  
  describe('resolvePermissions function', function(){
    it ('should exist', function(){
      expect(UserPermissions.resolvePermissions).toBeDefined();
      expect(UserPermissions.resolvePermissions).toEqual(jasmine.any(Function));
    });
    
    it ('should resolve the returned promise if the user has at least one of the permissions given', inject(['$timeout', function($timeout){
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      var promise = UserPermissions.resolvePermissions(['A_PERMISSION']);
      $timeout.flush();
      
      expect(promise.$$state.status).toEqual(1);
    }]));
    
    it ('should reject the returned promise if the user does not have at least one of the permissions given', inject(['$timeout', function($timeout){
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      var promise = UserPermissions.resolvePermissions(['A_PERMISSION']);
      $timeout.flush();
      
      expect(promise.$$state.status).toEqual(2);
    }]));
  });
});

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

jsedn.Map.prototype.remove = function(key) {
  this.keys.splice(key, 1);
  this.vals.splice(key, 1);
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

angular.module('liveopsConfigPanel.shared.services')
  .factory('ErrorInterceptor', ['$rootScope', '$q', '$injector', 'Alert', 'apiHostname', '$translate',
    function ($rootScope, $q, $injector, Alert, apiHostname, $translate) {

      return {
       'responseError': function(rejection) {

          //Only issue toasts if the user is logged in; we get no response from the API or a 500 and greater; and if the call was to the API endpoint
          if((rejection.status === 0 || rejection.status >= 500) && rejection.config.url.indexOf(apiHostname) > -1){
            Alert.error($translate.instant('api.error'));
          }

          return $q.reject(rejection);
        }
      };
    }

  ])
  .config(function ($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('ErrorInterceptor');
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

'use strict';

/*global spyOn, jasmine : false */

describe('DirtyForms service', function(){
  var DirtyForms;

  beforeEach(module('liveopsConfigPanel.shared.services'));

  beforeEach(inject(['DirtyForms', function(_DirtyForms_) {
    DirtyForms = _DirtyForms_;
  }]));

  it('registerForm function should add the item to the forms list', inject(function() {
    DirtyForms.registerForm({name: 'Thename'});
    expect(DirtyForms.forms.length).toBe(1);
    expect(DirtyForms.forms[0].name).toEqual('Thename');
  }));

  it('removeForm function should add the item to the forms list', inject(function() {
    var formItem = {name: 'Thename'};
    DirtyForms.forms.push(formItem);
    expect(DirtyForms.forms.length).toBe(1);
    DirtyForms.removeForm(formItem);
    expect(DirtyForms.forms.length).toBe(0);
  }));

  describe('hasDirty function', function(){
    it('should return true if one form is dirty', inject(function() {
      DirtyForms.forms.push({$dirty: true}, {$dirty: false});
      expect(DirtyForms.hasDirty()).toBeTruthy();
    }));

    it('should return false if there are no forms', inject(function() {
      expect(DirtyForms.hasDirty()).toBeFalsy();
    }));

    it('should return false if none of the forms are dirty', inject(function() {
      DirtyForms.forms.push({$dirty: false}, {$dirty: false});
      expect(DirtyForms.hasDirty()).toBeFalsy();
    }));
  });

  describe('confirmIfDirty function', function(){
    it('should check the hasDirty function', inject(function() {
      spyOn(DirtyForms, 'hasDirty');
      DirtyForms.confirmIfDirty(angular.noop);
      expect(DirtyForms.hasDirty).toHaveBeenCalled();
    }));

    it('should call Alert.confirm if there is a dirty form', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm');
      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      DirtyForms.confirmIfDirty(angular.noop);
      expect(Alert.confirm).toHaveBeenCalled();
    }]));

    it('should call the given function if confirm returns cancel', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        cancelCallback();
      });

      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    }]));

    it('should do nothing if the confirm returns ok', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });

      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    }]));

    it('should not show the confirm alert if no forms are dirty', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm');
      spyOn(DirtyForms, 'hasDirty').and.returnValue(false);
      DirtyForms.confirmIfDirty(angular.noop);
      expect(Alert.confirm).not.toHaveBeenCalled();
    }]));

    it('should immediately call the given function if no forms are dirty', inject([function() {
      spyOn(DirtyForms, 'hasDirty').and.returnValue(false);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    }]));
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

angular.module('liveopsConfigPanel.shared.directives.shared.directives')
  .directive('apiError', function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, elem, attr, ctrl){
        ctrl.$parsers.unshift(function(value){
          ctrl.$setValidity('api', true);
          return value;
        });
      }
    };
  });
'use strict';

describe('apiError directive', function(){
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel.shared.directives.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', function(_$compile_,_$rootScope_, $httpBackend, apiHostname) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]}); 
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});
  }]));

  it('should set the inputs to valid initially', inject(function() {
    $scope.myInput = 5;
    var element = $compile('<ng-form name="myForm"><input name="myInput" ng-model="myInput" api-error></input></ng-form>')($scope);
    $scope.$digest();
    
    $scope.myForm.myInput.$setViewValue('10'); //Force form to call $parsers
    $scope.$digest();
    
    expect(element.find('input').hasClass('ng-valid-api')).toBeTruthy();
  }));
});

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

describe('auditText directive', function () {
  var $scope,
    $compile,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content.management.tenantUsers'));

  beforeEach(module('pascalprecht.translate', function ($translateProvider) {
    $translateProvider.translations('en', {
      'value.displayName': '{{displayName}}',
      'plain.value': 'A string'
    });

    $translateProvider.preferredLanguage('en');
  }));

  beforeEach(inject(['$compile', '$rootScope', 'mockUsers',
    function (_$compile, $rootScope, mockUsers) {
      $scope = $rootScope.$new();
      $compile = _$compile;

      $scope.user = mockUsers[0];
    }
  ]));

  describe('refresh function', function () {
    it('should do a plain translate if not given a userId', function () {
      element = $compile('<audit-text translation="plain.value"></audit-text>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      var text = isolateScope.get();
      expect(text).toEqual('A string');
    });

    it('should translate the displayname with the one returned by tenantuser cache',
      inject(['$httpBackend', '$q', 'TenantUser', 'apiHostname', 'mockTenantUsers',
        function ($httpBackend, $q, TenantUser, apiHostname, mockTenantUsers) {
          $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(mockTenantUsers[0]);

          element = $compile('<audit-text translation="value.displayName" user-id="user.id"></audit-text>')($scope);
          $scope.$digest();
          isolateScope = element.isolateScope();

          isolateScope.get();

          $httpBackend.flush();

          expect(isolateScope.text).toEqual('Munoz Lowe');
        }
      ]));
  });

});
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

      templateUrl: 'app/shared/directives/autocomplete/autocomplete.html',

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

/* global spyOn: false */

describe('autocomplete directive', function(){
  var $scope,
    $compile,
    element,
    isolateScope,
    doDefaultCompile,
    $timeout;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$timeout', function(_$compile_, $rootScope, _$timeout_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $timeout = _$timeout_;

    $scope.items = [{
      content : 'firstItem',
      extraProp: 'true'
    }, {
      content: 'secondItem'
    }, {
      content: 'secondItemAgain'
    }, {
      content: 'thirdItem'
    }];

    $scope.selectFunction = function(){};

    doDefaultCompile = function(){
      element = $compile('<autocomplete items="items" name-field="content" on-select="selectFunction()" is-required="required" placeholder="Type here" hover="hover"></autocomplete>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should set item to empty string if there is no text', function() {
    doDefaultCompile();
    $scope.currentText = '';
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });

  it('should set item to empty string if there is only whitespace', function() {
    doDefaultCompile();
    $scope.currentText = '                 ';
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });

  it('should do nothing if selected item changes to an object', function() {
    doDefaultCompile();
    isolateScope.currentText = 'some text';
    $scope.selectedItem = {id : '5'};
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('some text');
  });

  describe('currentText watch', function(){
    it('should a new string if currentText has no matches', function() {
      doDefaultCompile();
      isolateScope.currentText = 'something new';
      isolateScope.$digest();
      expect(isolateScope.currentText).toEqual('something new');
    });

    it('should call onSelect if given', function() {
      doDefaultCompile();

      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      $timeout.flush();

      expect($scope.selectFunction).toHaveBeenCalled();
    });

    it('should not call onSelect if not given', function() {
      element = $compile('<autocomplete items="items" name-field="content" selected-item="selected" is-required="required" placeholder="Type here" hover="hover"></autocomplete>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      expect($scope.selectFunction).not.toHaveBeenCalled();
    });

    it('should not call onSelect if no match', function() {
      doDefaultCompile();

      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'A weird entry';
      isolateScope.$digest();
      expect($scope.selectFunction).not.toHaveBeenCalled();
    });
  });

  describe('select function', function(){
    it('should set the current text/selection', function() {
      doDefaultCompile();

      isolateScope.select({content : 'new item'});
      expect(isolateScope.currentText).toEqual('new item');
    });

    it('should clear hovering', function() {
      doDefaultCompile();

      isolateScope.select({content : 'new item'});
      expect(isolateScope.hovering).toEqual(false);
    });
  });
});

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
        templateUrl: 'app/shared/directives/bulkActionExecutor/bulkActionExecutor.html',
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

angular.module('liveopsConfigPanel.shared.directives.mock.shared.directives.bulkAction', ['liveopsConfigPanel.shared.directives.mock.content'])
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

describe('bulkActionExecutor directive', function () {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.shared.directives.bulkAction'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content.management.users'));

  beforeEach(inject(['$rootScope', function ($rootScope) {
    $scope = $rootScope.$new();
  }]));

  beforeEach(inject(['$compile', 'BulkAction', 'mockBulkActions', 'mockUsers',
    function ($compile, BulkAction, mockBulkActions, mockUsers) {
      $scope.items = mockUsers;
      $scope.items[0].checked = true;
      $scope.items[1].checked = true;
      $scope.items[2].checked = false;

      $scope.bulkActions = mockBulkActions;
      $scope.showBulkActions = true;

      var element = $compile('<bulk-action-executor items="items" bulk-actions="bulkActions" show-bulk-actions="showBulkActions"></bulk-action-executor>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  describe('ON execute', function () {
    it('should call execute for all checked items', inject([function () {
        isolateScope.execute();

        expect(isolateScope.bulkActions[0].execute).toHaveBeenCalledWith([
          isolateScope.items[0],
          isolateScope.items[1]
        ]);
        expect(isolateScope.bulkActions[1].execute).not.toHaveBeenCalled();
      }
    ]));

    it('should not call execute for unchecked bulkAction', inject([function () {
        isolateScope.execute();

        expect(isolateScope.bulkActions[1].execute).not.toHaveBeenCalled();
      }
    ]));

    it('should call Alert when all promises resolve', inject(['$httpBackend', 'Alert',
      function ($httpBackend, Alert) {
        spyOn(Alert, 'success');

        isolateScope.execute();
        isolateScope.$digest();
        expect(Alert.success).toHaveBeenCalled();
      }
    ]));
  });

  describe('ON canExecute', function () {
    it('should return false if no bulkActions are checked', function () {
      isolateScope.bulkActions[0].checked = false;
      isolateScope.bulkActions[1].checked = false;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy();
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy();

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeFalsy();
      expect(isolateScope.bulkActions[0].canExecute).not.toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).not.toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      isolateScope.bulkActions[0].checked = true;
      isolateScope.bulkActions[1].checked = true;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(false);

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeFalsy();
      expect(isolateScope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      isolateScope.bulkActions[0].checked = true;
      isolateScope.bulkActions[1].checked = true;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeTruthy();
      expect(isolateScope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).toHaveBeenCalled();
    });
  });

  describe('ON selectedItems', function () {
    it('should return all checked items', function() {
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems.length).toEqual(2);
    });

    it('should never break the $scope.checkedItems reference', function() {
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems).toBe(checkedItems);
    });
    
    it('should return items in order, if given dropOrderBy', function() {
      $scope.items[0].sortField = 2;
      $scope.items[1].sortField = 1;
      $scope.items[2].sortField = 3;
      isolateScope.dropOrderBy = 'sortField';
      var checkedItems = isolateScope.selectedItems();
      
      expect(checkedItems[0]).toBe($scope.items[1]);
      expect(checkedItems[1]).toBe($scope.items[0]);
    });
  });

  describe('showBulkActions watch', function () {
    it('should call reset form is showBulkActions becomes false', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = false;
      isolateScope.$digest();

      expect(isolateScope.resetForm).toHaveBeenCalled();
    });

    it('should not reset the form if showBulkActions becomes true', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = true;
      isolateScope.$digest();

      expect(isolateScope.resetForm).not.toHaveBeenCalled();
    });
  });
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loCancelChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormCancel'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chain = Chain.get($attrs.loCancelChainExecutor);

          chain.hook('cancel', function() {
            return $ctrl[0].cancel();
          });
          
          chain.execute();
          $scope.$apply();
        });
      }
    };
  }]);

'use strict';

describe('loCancelChainExecutor directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  var chain;
  beforeEach(inject(['Chain', function(Chain) {
    chain = {
      execute: jasmine.createSpy('chain execute'),
      hook: jasmine.createSpy('chain hook')
    };

    spyOn(Chain, 'get').and.returnValue(chain);
  }]));

  describe('ON default event click', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel ng-resource><a lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).toHaveBeenCalled();
    });
  });

  describe('ON event dblclick', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel ng-resource><a event="dblclick" lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on dblclick', function() {
      element.find('a').triggerHandler('dblclick');
      expect(chain.execute).toHaveBeenCalled();
    });

    it('should not execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).not.toHaveBeenCalled();
    });
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attrs) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chainName = $attrs.loChainExecutor;
          Chain.get(chainName).execute();
          $scope.$apply();
        });
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmitChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chain = Chain.get($attrs.loSubmitChainExecutor);
          
          chain.hook('post form submit', {
            success: function(resource) {
              $ctrl[0].resetForm();
              return resource;
            },
            failure: function(error) {
              $ctrl[0].populateApiErrors(error);
              return error;
            }
          });

          chain.hook('emit event', {
            success: function(resource) {
              $scope.$emit('form:submit:success', resource);
            },
            failure: function(error) {
              $scope.$emit('form:submit:failure', error);
            }
          });
          
          chain.execute();
          $scope.$apply();
        });
      }
    };
  }]);

'use strict';

describe('loSubmitChainExecutor directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  var chain;
  beforeEach(inject(['Chain', function(Chain) {
    chain = {
      execute: jasmine.createSpy('chain execute'),
      hook: jasmine.createSpy('chain hook')
    };

    spyOn(Chain, 'get').and.returnValue(chain);
  }]));

  describe('ON default event click', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel lo-form-submit ng-resource><a lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).toHaveBeenCalled();
    });
  });

  describe('ON event dblclick', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel lo-form-submit ng-resource><a event="dblclick" lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on dblclick', function() {
      element.find('a').triggerHandler('dblclick');
      expect(chain.execute).toHaveBeenCalled();
    });

    it('should not execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).not.toHaveBeenCalled();
    });
  });
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

describe('concatStrings directive', function(){
  var $scope,
    $compile,
    $templateCache,
    $httpBackend;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$templateCache', '$httpBackend', function(_$compile_, _$rootScope_, _$templateCache_, _$httpBackend_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $httpBackend = _$httpBackend_;
  }]));

  it('should retrieve a template from cache and make it the content of its element', inject(function() {
    $templateCache.put('thing.html', 'Hello');

    var element = $compile('<div compiled-include="thing.html"></div>')($scope);
    $scope.$digest();
    expect(element.text()).toEqual('Hello');
  }));

  it('should make a GET to retrieve the template, place it in cache, and make it the content of its element', inject(function() {
    $httpBackend.expectGET('other.html').respond(200, 'Goodbye');
    var element = $compile('<div compiled-include="other.html"></div>')($scope);
    $scope.$digest();
    $httpBackend.flush();

    expect(element.text()).toEqual('Goodbye');
    expect($templateCache.get('other.html')).toEqual('Goodbye');
  }));
});

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

describe('loFormAlert directive', function() {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope',
    function($compile, $rootScope) {
      $scope = $rootScope.$new();
      
      $scope.ngResource = {
        isNew: jasmine.createSpy('ngResource.isNew'),
        reset: jasmine.createSpy('ngResource.reset'),
        email: 'test@tester.com'
      };
      
      var element = angular.element('<div><ng-form name="form1" lo-form-submit="chain1" lo-form-cancel="" ng-resource="ngResource" lo-form-alert></ng-form></div>');
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);
      
      $scope.$digest();
      isolateScope = element.find('ng-form').scope();
    }
  ]));

  beforeEach(inject(['Alert', function(Alert) {
    spyOn(Alert, 'success');
    spyOn(Alert, 'error');
  }]));

  describe('ON form:submit:success', function() {
    it('should alert with a success message for create', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:success', {
        updated: false
      });

      expect(Alert.success).toHaveBeenCalledWith('Record saved');
    }]));

    it('should alert with a success message for update', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:success', {
        updated: true
      });

      expect(Alert.success).toHaveBeenCalledWith('Record updated');
    }]));
  });

  describe('ON form:submit:failure', function() {
    it('should alert with a failure message', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:failure', {
        updated: false
      });
      expect(Alert.error).toHaveBeenCalledWith('Record failed to save');
    }]));

    it('should alert with a failure message', inject(['Alert', function(Alert) {
      $scope.$broadcast('form:submit:failure', {
        updated: true
      });
      expect(Alert.error).toHaveBeenCalledWith('Record failed to update');
    }]));
  });

});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormCancel', ['$parse', 'Chain', 'DirtyForms', '$timeout', '$rootScope',
    function ($parse, Chain, DirtyForms, $timeout, $rootScope) {
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

describe('loFormCancel directive', function() {
  var $scope,
    element,
    isolateScope,
    loFormCancelController;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', 'DirtyForms',
    function($compile, $rootScope, DirtyForms) {
      $scope = $rootScope.$new();

      $scope.ngResource = {
        email: 'test@tester.com',
        isNew: jasmine.createSpy('ngResource.isNew').and.callThrough(),
        reset: jasmine.createSpy('ngResource.isNew').and.callThrough()
      };

      //http://stackoverflow.com/questions/19227036/testing-directives-that-require-controllers
      element = angular.element('<div><ng-form ng-resource="ngResource" lo-form-cancel="chain1" name="form1"><input ng-model="ngResource.email" name="email" type="email" required></ng-form></div>');
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      loFormCancelController = element.find('ng-form').controller('loFormCancel');

      spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback) {
        callback();
      });
    }
  ]));

  beforeEach(function() {
    isolateScope.ngResource.isNew = jasmine.createSpy('ngResource.isNew');
    isolateScope.ngResource.reset = jasmine.createSpy('ngResource.reset');
  });

  describe('ON ngResource change', function() {
    beforeEach(function() {
      loFormCancelController.resetForm = jasmine.createSpy('loFormCancelController.resetForm');
    });

    it('should call resetForm on ngResource change', function() {
      var oldResource = isolateScope.ngResource;
      isolateScope.ngResource = {
        isNew: jasmine.createSpy('new ngResource.isNew'),
        reset: jasmine.createSpy('new ngResource.reset'),
        email: 'new@tester.com'
      };

      isolateScope.$digest();

      expect(loFormCancelController.resetForm).toHaveBeenCalled();
      expect(oldResource.reset).toHaveBeenCalled();
    });
  });

  describe('ON controller.resetForm', function() {
    var formController;

    beforeEach(function() {
      formController = element.find('ng-form').controller('form');
      spyOn(formController, '$setPristine');
      spyOn(formController, '$setUntouched');

      spyOn(formController.email, '$setViewValue');
      spyOn(formController.email, '$rollbackViewValue');
    });

    it('should always $setPristine and $setUntouched on call', function() {
      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();
    });

    it('should not $setViewValue to displayValue and $rollbackViewValue if field is valid', function() {
      loFormCancelController.resetForm(formController);
      expect(formController.email.$setViewValue).not.toHaveBeenCalled();
      expect(formController.email.$rollbackViewValue).not.toHaveBeenCalled();
    });

    it('should $setViewValue to displayValue and $rollbackViewValue if field is invalid', function() {
      isolateScope.ngResource.email = 'test@';
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalled();
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });

    it('should $setViewValue to undefined if displayValue is null', function() {
      isolateScope.ngResource.email = null;
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalledWith(undefined);
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });
  });

  describe('ON controller.cancel', function() {
    beforeEach(function() {
      spyOn(loFormCancelController, 'resetForm');
    });

    describe('WHERE ngResource is new', function() {
      beforeEach(function() {
        isolateScope.ngResource.isNew = jasmine.createSpy('ngReource.isNew').and.returnValue(true);
      });

      it('should call detailsPanel.close when form is clean', inject([function() {
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
        loFormCancelController.cancel();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));

      it('should not call detailsPanel.close when form is dirty', inject([function() {
        element.find('ng-form').controller('form').$setDirty();
        loFormCancelController.cancel();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));
    });

    describe('WHERE ngResource is not new and form is dirty', function() {
      beforeEach(function() {
        isolateScope.ngResource.isNew = jasmine.createSpy('ngReource.isNew').and.returnValue(false);
        element.find('ng-form').controller('form').$setDirty();
      });

      it('should call loFormCancel.resetForm and resource.reset', inject(['$timeout', function($timeout) {
        loFormCancelController.cancel();
        $timeout.flush();
        expect(loFormCancelController.resetForm).toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).toHaveBeenCalled();
      }]));
    });
  });
});

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
  .directive('loFormSubmit', ['$parse', 'Chain',
    function($parse) {
      return {
        restrict: 'A',
        require: 'form',
        controller: function($scope) {
          var self = this;
          
          self.errorInputWatchesUnbinds = {};
          
          this.populateApiErrors = function(error) {
            if ($parse('data.error')(error)) {
              angular.forEach(error.data.error.attribute,
                function(value, key) {
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

describe('loFormSubmit directive', function() {
  var $scope,
    element,
    isolateScope,
    loFormSubmitController,
    elementString;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$rootScope',
    function($rootScope) {
      $scope = $rootScope.$new();

      $scope.ngResource = {
        email: 'test@tester.com',
        isNew: jasmine.createSpy('ngResource.isNew'),
        reset: jasmine.createSpy('ngResource.reset')
      };

      elementString = '<div><ng-form ng-resource="ngResource" lo-form-submit="chain1"' +
        'lo-form-cancel name="form1"><input ng-model="ngResource.email" ' +
        'name="email" type="email" required></ng-form></div>';
    }
  ]));

  describe('ON populateApiErrors', function() {
    var error,
      formController;

    beforeEach(inject(['$compile', function($compile) {
      error = {
        data: {
          error: {
            attribute: {
              email: 'Invalid email.'
            }
          }
        }
      };

      element = angular.element(elementString);
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      formController = element.find('ng-form').controller('form');
      loFormSubmitController = element.find('ng-form').controller('loFormSubmit');
    }]));

    it('should $setValidity for field', inject(['$timeout',
      function($timeout) {
        spyOn(formController.email, '$setValidity');
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setValidity).toHaveBeenCalledWith('api', false);
      }
    ]));

    it('should set $error for field', inject(['$timeout',
      function( $timeout) {
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$error).toEqual({
          api: 'Invalid email.'
        });
      }
    ]));

    it('should $setTouched for field', inject(['$timeout',
      function($timeout) {
        spyOn(formController.email, '$setTouched');
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setTouched).toHaveBeenCalled();
      }
    ]));

    it('should do nothing if error is none-standard', inject(['$timeout',
      function($timeout) {
        error.data = undefined;
        spyOn(formController.email, '$setValidity');
        spyOn(formController.email, '$setTouched');

        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setValidity).not.toHaveBeenCalled();
        expect(formController.email.$setTouched).not.toHaveBeenCalled();
      }
    ]));
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmit', ['$q', function ($q) {
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
  .directive('loDetailsPanel', ['$location', 'DirtyForms',
    function ($location, DirtyForms) {
      return {
        restrict: 'EA',
        require: ['ngResource'],
        transclude: true,
        templateUrl: 'app/shared/directives/detailsPanel/detailsPanel.html',
        scope: {
          ngResource: '='
        },
        controller: function($scope) {
          this.close = function() {
            DirtyForms.confirmIfDirty(function(){
              $location.search({id : null});
              $scope.ngResource = null;
              $scope.$emit('details:panel:close');
            });
          };

          $scope.close = this.close;
        }
      };
    }
  ]);

'use strict';

describe('loDetailsPanel directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams',
    function($compile, $rootScope, $stateParams) {
      $scope = $rootScope.$new();
      $scope.ngResource = {};

      element = $compile('<lo-details-panel ng-resource="ngResource"></lo-details-panel>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      $stateParams.id = 1;
    }
  ]));

  describe('ON close', function() {
    it('should exists', function() {
      expect(isolateScope.close).toBeDefined();
    });

    describe('WHEN confirmIfDirty passes', function() {
      beforeEach(inject(['DirtyForms', function(DirtyForms) {
        spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback) {
          callback();
        });
      }]));

      it('should nullify the $location search id', inject(['$location', function($location) {
        spyOn($location, 'search');
        isolateScope.close();
        expect($location.search).toHaveBeenCalledWith({id: null});
      }]));

      it('should nullify the ngResource', function() {
        expect(isolateScope.ngResource).not.toBeNull();
        isolateScope.close();
        expect(isolateScope.ngResource).toBeNull();
      });
    });

    describe('WHEN confirmIfDirty fails', function() {
      beforeEach(inject(['DirtyForms', function(DirtyForms) {
        spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function() {
          return;
        });
      }]));

      it('should not nullify the ngResource', function() {
        expect(isolateScope.ngResource).not.toBeNull();
        isolateScope.close();
        expect(isolateScope.ngResource).not.toBeNull();
      });
    });
  });
});

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

describe('disableContents directive', function(){
  var $scope,
    $compile,
    element;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile;
  }]));
  
  it('should disable all inputs in the element when expression is true', function() {
    element = $compile('<div disable-contents="true"><input type="text"></input><input type="url"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].hasAttribute('disabled')).toBeTruthy();
    expect(inputs[1].hasAttribute('disabled')).toBeTruthy();
  });
  
  it('should not disable inputs in the element when expression is false', function() {
    element = $compile('<div disable-contents="false"><input type="text"></input><input type="url"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].hasAttribute('disabled')).toBeFalsy();
    expect(inputs[1].hasAttribute('disabled')).toBeFalsy();
  });
  
  it('should disable all labels in the element when expression is true', function() {
    element = $compile('<div disable-contents="true"><label></label></div>')($scope);
    $scope.$digest();
    
    var labels = element.find('label');
    expect(labels.length).toBe(1);
    expect(labels[0].hasAttribute('disabled')).toBeTruthy();
  });
  
  it('should not disable labels in the element when expression is false', function() {
    element = $compile('<div disable-contents="false"><label></label></div>')($scope);
    $scope.$digest();
    
    var labels = element.find('label');
    expect(labels.length).toBe(1);
    expect(labels[0].hasAttribute('disabled')).toBeFalsy();
  });
  
  it('should not overwrite existing ng-disabled attributes', function() {
    element = $compile('<div disable-contents="true"><input ng-disabled="myVal"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(1);
    expect(inputs.attr('ng-disabled')).toEqual('myVal || true');
  });
});
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

/* global jasmine, spyOn: false */
describe('DropdownController', function() {
    var $scope,
        $document,
        controller,
        $element;

    beforeEach(module('liveopsConfigPanel.shared.directives'));

    beforeEach(inject(['$rootScope', '$controller', '$document', '$httpBackend', 'apiHostname', function($rootScope, $controller, _$document_, $httpBackend, apiHostname) {
      $scope = $rootScope.$new();
      $document = _$document_;
      $element = {};
      
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({});
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({});
      
      controller = $controller('DropdownController', {'$scope': $scope, '$element' : $element});
    }]));

    it('should hide the dropdown to start', inject(function() {
      expect($scope.showDrop).toBeFalsy();
    }));
    
    it('should attach the click listener when showDrop becomes true', inject(function() {
      spyOn($document, 'on');
      $scope.showDrop = false;
      $scope.$digest();
      $scope.showDrop = true;
      $scope.$digest();
      expect($document.on).toHaveBeenCalledWith('click', jasmine.any(Function));
    }));
    
    describe('setShowDrop function', function(){
      it('should exist', inject(function() {
        expect(controller.setShowDrop).toBeDefined();
        expect(controller.setShowDrop).toEqual(jasmine.any(Function));
      }));
      
      it('should set the showDrop value', inject(function() {
        $scope.showDrop = false;
        controller.setShowDrop(true);
        expect($scope.showDrop).toBeTruthy();
        
        $scope.showDrop = true;
        controller.setShowDrop(false);
        expect($scope.showDrop).toBeFalsy();
      }));
    });
    
    describe('onClick function', function(){
      it('should exist', inject(function() {
        expect(controller.onClick).toBeDefined();
        expect(controller.onClick).toEqual(jasmine.any(Function));
      }));
      
      it('should set showDrop and Hovering to false when clicking outside the element', function() {
        $scope.showDrop = true;
        $scope.hovering = true;
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([]);
        
        controller.onClick({target: {}});
        expect($scope.showDrop).toBeFalsy();
        expect($scope.hovering).toBeFalsy();
      });
      
      it('should remove the click event listener', function() {
        spyOn($document, 'off');
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([]);
        
        controller.onClick({target: {}});
        expect($document.off).toHaveBeenCalledWith('click', jasmine.any(Function));
      });
      
      it('should do noting if clicking inside the element', function() {
        $scope.showDrop = true;
        $scope.hovering = true;
        spyOn($document, 'off');
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([true]);
        
        controller.onClick({target: {}});
        expect($scope.showDrop).toBeTruthy();
        expect($scope.hovering).toBeTruthy();
        expect($document.off).not.toHaveBeenCalled();
      });
    });
});
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
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
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
          func();
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

describe('dropdown directive', function(){
  var $scope,
    $compile,
    $document,
    element,
    items,
    isolateScope,
    hoverControllerSpy;
  
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', '$document', function(_$compile_,_$rootScope_, _$document_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $document = _$document_;
    
    items = [
             {label: 'One'},
             {label: 'Another'}
            ];
    $scope.items = items;
  }]));
  
  it('should add an li item for each item given', inject(function() {
    element = $compile('<dropdown label="My Dropdown" items="items"></dropdown>')($scope);
    $scope.$digest();
    expect(element.find('li').length).toEqual(2);
  }));
  
  describe('optionClick function', function(){
    beforeEach(function(){
      element = $compile('<dropdown label="My Dropdown" items="items"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should call the given function', inject(function() {
      var clickSpy = jasmine.createSpy('optionClick');
      isolateScope.optionClick(clickSpy);
      
      expect(clickSpy).toHaveBeenCalled();
    }));
    
    it('should hide the dropdown', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.optionClick(angular.noop);
      expect(isolateScope.showDrop).toBeFalsy();
    }));
  });
  
  it('should add the controller to hoverTracker if given', inject(function() {
    $scope.hovering = false;
    $scope.hovers = [];
    element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering" hover-tracker="hovers"></dropdown>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    
    expect($scope.hovers.length).toBe(1);
  }));
  
  describe('clearOtherHovers function', function(){
    beforeEach(function(){
      hoverControllerSpy = jasmine.createSpyObj('controller', ['setShowDrop']);
      $scope.hovering = false;
      $scope.hovers = [hoverControllerSpy];
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering" hover-tracker="hovers"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should set show drop to false for all other controllers', inject(function() {
      isolateScope.clearOtherHovers();
      expect(hoverControllerSpy.setShowDrop).toHaveBeenCalledWith(false);
    }));
    
    it('should leave showdrop intact for the current controller', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.clearOtherHovers();
      expect(isolateScope.showDrop).toBeTruthy();
    }));
  });
  
  describe('mouseIn function', function(){
    beforeEach(function(){
      $scope.hovering = false;
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      spyOn(isolateScope, 'clearOtherHovers');
    });
    
    it('should call clearOtherHovers and showDrop when hovering', inject(function() {
      isolateScope.hovering = true;
      isolateScope.mouseIn();
      expect(isolateScope.showDrop).toBeTruthy();
      expect(isolateScope.clearOtherHovers).toHaveBeenCalled();
    }));
    
    it('should do nothing if hovering', inject(function() {
      isolateScope.hovering = false;
      isolateScope.mouseIn();
      expect(isolateScope.showDrop).toBeFalsy();
      expect(isolateScope.clearOtherHovers).not.toHaveBeenCalled();
    }));
  });
  
  describe('dropClick function', function(){
    beforeEach(function(){
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should toggle showDrop', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.dropClick();
      expect(isolateScope.showDrop).toBeFalsy();
      
      isolateScope.showDrop = false;
      isolateScope.dropClick();
      expect(isolateScope.showDrop).toBeTruthy();
    }));
    
    it('should toggle hovering', inject(function() {
      isolateScope.hovering = true;
      isolateScope.dropClick();
      expect(isolateScope.hovering).toBeFalsy();
      
      isolateScope.hovering = false;
      isolateScope.dropClick();
      expect(isolateScope.hovering).toBeTruthy();
    }));
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('filterDropdown', [function () {
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
      templateUrl: 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope, element) {
        element.parent().css('overflow', 'visible');

        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';
        
        $scope.checkItem = function (option) {
          option.checked = !option.checked;

          $scope.$emit('dropdown:item:checked', option);
        };

        // not ideal; we are adding a property to an object that will be used
        // in multiple places; however I cannot find a better way to do this.
        if ($scope.showAll) {

          // if an option has been selected; if any option was checked, set
          // all to false. if no options are checked, set all to true
          $scope.$watch('options', function () {
            var anyChecked = false;

            angular.forEach($scope.options, function (option) {
              if (option.checked) {
                anyChecked = true;
                $scope.all.checked = false;
              }
            });

            if (!anyChecked) {
              $scope.all.checked = true;
            }
          }, true);

          var checkAllByDefault = true;
          angular.forEach($scope.options, function (option) {
            checkAllByDefault = checkAllByDefault && option.checked;
          });
          $scope.all = {
            checked: checkAllByDefault
          };

          // if all is checked; then set the rest of the options to false
          $scope.$watch('all.checked', function () {
            if ($scope.all.checked) {
              angular.forEach($scope.options, function (option) {
                option.checked = false;
              });
            }
          });
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

'use strict';

describe('filterDropdown directive', function(){
  var $scope,
    $childScope,
    $compile,
    element,
    statuses
    ;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname',
  function(_$compile_,_$rootScope_,$httpBackend, apiHostname) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;

    statuses = [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}];
    $scope.statuses = statuses;

    element = $compile('<filter-dropdown show-all="true" label="Some Label" options="statuses"></filter-dropdown>')($scope);
    $scope.$digest();

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]});

    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});

    $childScope = element.isolateScope();
  }]));

  it('should add checkboxes for each filter value, and also one for the all value', inject(function() {
    expect(element.find('input').length).toEqual(3);
  }));

  it('should add the "all" class to the "all" value container', inject(function() {
    var allContainer = element[0].querySelectorAll('.all');
    expect(angular.element(allContainer).hasClass('all')).toBe(true);

    var allCheckbox = allContainer[0].querySelectorAll('[name=all]');
    expect(angular.element(allCheckbox)).toBeTruthy();
  }));

  it('should not add the all field if the filters dont provide one', inject(function() {
    var newStatuses = {filters : [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}]};
    $scope.newStatuses = newStatuses;

    element = $compile('<filter-dropdown label="Some Label" items="newStatuses"></filter-dropdown>')($scope);
    $scope.$digest();

    var allContainer = element[0].querySelectorAll('.all');
    expect(allContainer.length).toEqual(0);
  }));

  it('should uncheck the "all" value when a filter is enabled', inject(function() {
    expect($childScope.all.checked).toBe(true);

    $scope.statuses[0].checked = true;
    $scope.$digest();

    // expect($scope.all.checked).toBe(false);
  }));

  it('should check the other filters when "all" is checked', inject(function() {
    statuses = [{display: 'Disabled', value: 'false', checked: true}];
    $scope.statuses = statuses;

    element = $compile('<filter-dropdown show-all="true" label="Some Label" items="statuses"></filter-dropdown>')($scope);
    $scope.$digest();
    $childScope.all.checked = false;
    expect($childScope.all.checked).toBeFalsy(false);
    // expect($scope.statuses[0].checked).toBeFalsy(false);

    $childScope.all.checked = true;
    expect($childScope.all.checked).toBeTruthy(false);
    expect($scope.statuses[0].checked).toBeTruthy(true);
  }));

  it('should keep the dropdown hidden by default', inject(function() {
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));

  it('should show the dropdown when the label is clicked', inject(function() {
    element.find('.dropdown-label').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(false);
  }));

  it('should hide an already-open dropdown when the label is clicked', inject(function() {
    element.find('.dropdown-label').click();
    element.find('.dropdown-label').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));

  it('should update the item.checked value when the check wrapper div is clicked', inject(function() {
    $childScope.all.checked = true;
    var allContainer = element[0].querySelectorAll('.all');
    var allElement = angular.element(allContainer);

    allElement.click();
    expect($childScope.all.checked).toBeFalsy();

    $scope.statuses[0].checked = true;
    var filterContainer = element[0].querySelectorAll('.dropdown-option');
    var filterElement = angular.element(filterContainer[0]);

    filterElement.click();
    expect($scope.statuses[0].checked).toBeFalsy();
  }));
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('formError', function() {
    return {
      templateUrl : 'app/shared/directives/formError/formError.html',
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

/* global spyOn: false */
describe('EditFieldController', function() {
    var $scope;

    beforeEach(module('liveopsConfigPanel.shared.directives'));

    beforeEach(inject(['$rootScope', '$controller', function($rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller('EditFieldController', {'$scope': $scope});
    }]));

    describe('saveHandler function', function() {
      it('should blur the element on save', inject(function() {
        var wasCalled = false;
        
        var event = {
            target : {
              blur : function(){wasCalled = true;}
            }
        };
        
        $scope.saveHandler(event);
        expect(wasCalled).toBeTruthy();
      }));
      
      it('should emit the editField:save event', inject(function() {
        $scope.objectId = 1;
        $scope.name = 'name';
        $scope.ngModel = 'value';
        
        spyOn($scope, '$emit');
        $scope.saveHandler();
        
        expect($scope.$emit).toHaveBeenCalledWith('editField:save', {objectId: 1, fieldName: 'name', fieldValue: 'value'});
      }));
    });
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    return {
      templateUrl : 'app/shared/directives/helpIcon/helpIcon.html',
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

describe('helpIcon directive', function(){
  var $scope,
    isolateScope,
    $compile,
    element
    ;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;

    element = $compile('<help-icon text="my tooltip text"></help-icon>')($scope);
    $scope.$digest();

    isolateScope = element.isolateScope();
  }]));

  it('should render an icon', inject(function() {
    expect(element.find('i').length).toEqual(2);
    expect(element.find('i').hasClass('fa')).toBeTruthy();
  }));
  
  describe('showTooltip function', function(){
    it('should append a tooltip to the body', inject(['$document', function($document) {
      var mockBody = jasmine.createSpyObj('mockBody', ['append']);
      spyOn($document, 'find').and.returnValue(mockBody);
      isolateScope.showTooltip();
      
      expect($document.find).toHaveBeenCalledWith('body');
      
      var firstAppendArg = mockBody.append.calls.mostRecent().args[0];
      expect(firstAppendArg[0].outerHTML).toContain('</tooltip>');
    }]));
  });
  
  describe('destroyTooltip function', function(){
    it('should remove the tooltip from the body', inject(['$document', function($document) {
      isolateScope.showTooltip();
      
      expect($document.find('tooltip').length).toBe(1);
      
      isolateScope.destroyTooltip();
      
      expect($document.find('tooltip').length).toBe(0);
    }]));
  });
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

/* global spyOn: false */

describe('highlightOnClick directive', function(){
  var $scope,
    $window,
    element;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$window', function($compile, _$rootScope_, _$window_) {
    $scope = _$rootScope_.$new();
    $window = _$window_;
    
    $scope.myInput = 'hello, world';
    element = $compile('<input ng-model="myInput" highlight-on-click></input>')($scope);
    $scope.$digest();
  }]));

  //TODO: Haven't figured out how to read the selected text to verify that it's being set correctly
  
  it('should check window.getselection', inject(function() {
    spyOn($window, 'getSelection').and.callThrough();
    element.triggerHandler('click');
    expect($window.getSelection).toHaveBeenCalled();
  }));
  
  it('should do nothing if the window has something selected', inject(function() {
    spyOn($window, 'getSelection').and.callFake(function(){
      return 'A prior selection';
    });
    element.triggerHandler('click');
    expect($window.getSelection()).toEqual('A prior selection'); //TODO: This may not be the actual way to verify selected text?
  }));
});

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
      templateUrl: 'app/shared/directives/loMultibox/loMultibox.html',
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

describe('loMultibox directive', function(){
  var $scope,
    element,
    isolateScope,
    $rootScope;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;

    $scope.items = [{
      displayname: 'the first',
      id: '123',
      otherprop: 'Red',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('the first')
    }, {
      displayname: 'second',
      id: '456',
      otherprop: 'Blue',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('second')
    }, {
      displayname: '3',
      id: '789',
      otherprop: 'Yellow',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('3')
    }];
    
    $scope.selectedItem = $scope.items[1];

    element = $compile('<lo-multibox items="items" selected-item="selectedItem" ' +
      'resource-name="myresource"></lo-multibox>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should add a typeahead field', inject(function() {
    expect(element.find('type-ahead').length).toEqual(1);
  }));

  it('should catch create event and select the created resource, if in create mode', inject([function () {
    var newItem =  {
      displayname: 'fourth',
      id: 'new',
      otherprop: 'Aqua'
    };

    isolateScope.createMode = true;
    spyOn(isolateScope, 'onSelect');

    $rootScope.$broadcast('created:resource:myresource', newItem);

    isolateScope.$digest();
    expect(isolateScope.onSelect).toHaveBeenCalledWith(newItem);
  }]));

  it('should catch create event but do nothing if not in create mode', function () {
    isolateScope.createMode = false;
    spyOn(isolateScope, 'onSelect');
    $rootScope.$broadcast('created:resource:myresource', {});
    isolateScope.$digest();
    expect(isolateScope.onSelect).not.toHaveBeenCalled();
  });

  it('should catch cancel event and disable create mode', function () {
    isolateScope.createMode = true;
    $rootScope.$broadcast('resource:details:myresource:canceled', {});
    isolateScope.$digest();
    expect(isolateScope.createMode).toBeFalsy();
  });

  describe('onSelect function', function () {
    it('should disable edit and showDrop modes', inject(function () {
      isolateScope.showDrop = true;
      isolateScope.createMode = true;

      isolateScope.onSelect({
        getDisplay: jasmine.createSpy('getDisplay').and.returnValue('1234'),
        id: '1234'
      });
      $scope.$digest();

      expect(isolateScope.showDrop).toBeFalsy();
      expect(isolateScope.createMode).toBeFalsy();
    }));
  });

  describe('createItem function', function () {
    it('should exist', function () {
      expect(isolateScope.createItem).toBeDefined();
      expect(isolateScope.createItem).toEqual(jasmine.any(Function));
    });

    it('should emit the create event', inject(function () {
      spyOn(isolateScope, '$emit');
      isolateScope.createItem();
      expect(isolateScope.$emit).toHaveBeenCalledWith('resource:details:create:myresource',
        jasmine.any(Object));
    }));
  });

  describe('labelClick function', function () {
    it('should exist', function () {
      expect(isolateScope.labelClick).toBeDefined();
      expect(isolateScope.labelClick).toEqual(jasmine.any(Function));
    });

    it('should toggle showDrop', inject(function () {
      isolateScope.showDrop = true;
      isolateScope.labelClick();
      expect(isolateScope.showDrop).toBeFalsy();

      isolateScope.labelClick();
      expect(isolateScope.showDrop).toBeTruthy();
    }));

    it('should reset the selected item', inject(function () {
      isolateScope.selectedItem = {prop: 'value'};
      isolateScope.labelClick();
      expect(isolateScope.selectedItem).toBeNull();
    }));
  });
});

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

describe('filterDropdown directive', function(){
  var $scope,
    element,
    doCompile,
    isolateScope
    ;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope',
    function ($compile, _$rootScope_) {
      $scope = _$rootScope_.$new();

      doCompile = function(){
        element = $compile('<input lo-submit-spinner lo-submit-spinner-status="loading">')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should hide the element and show the spinner when loading is true', inject(function() {
    $scope.loading = false;

    doCompile();

    expect(element.hasClass('ng-hide')).toBeFalsy();
    expect(isolateScope.spinnerElement.hasClass('ng-hide')).toBeTruthy();
  }));

  it('should hide the element and show the spinner when loading is true', inject(function() {
    $scope.loading = true;

    doCompile();

    expect(element.hasClass('ng-hide')).toBeTruthy();
    expect(isolateScope.spinnerElement.hasClass('ng-hide')).toBeFalsy();
  }));

});

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
  .directive('loading', [function() {
    return {
      restrict : 'E',
      templateUrl : 'app/shared/directives/loading/loading.html'
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
.directive('modal', [function () {
  return {
    restrict: 'E',
    templateUrl : 'app/shared/directives/modal/modal.html'
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

describe('ngResource directive', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    $scope.ngResource = {};

    element = $compile('<div ng-resource="ngResource"></div>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should do something someday', function() {});
});

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

      templateUrl : 'app/shared/directives/resizeHandle/resizeHandle.html',
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

/*global jasmine, spyOn : false */

describe('resizeHandle directive', function(){
  var $scope,
    $document,
    element,
    leftSpy,
    rightSpy,
    isolateScope;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$document', function($compile,_$rootScope_, _$document_) {
    $scope = _$rootScope_.$new();
    $document = _$document_;

    var target = $compile('<div id="left" style="width: 300px;"></div><span id="right" style="width: 600px;"></span>')($scope);
    angular.element($document[0].body).append(target);
    element = $compile('<resize-handle left-element-id="left" right-element-id="right" right-min-width="0" left-min-width="0"></resize-handle>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should add div with the resizable-handle class', inject(function() {
    var handle = element[0].querySelectorAll('.resizable-handle');
    expect(angular.element(handle).hasClass('resizable-handle')).toBe(true);
  }));

  it('should be call resizeElements on mousemove', inject(function() {
    element.triggerHandler( {type: 'mousedown', button: 1, preventDefault: function(){}});
    spyOn(element.isolateScope(), 'resizeElements');
    var event = {type: 'mousemove', pageX: 100};
    $document.triggerHandler(event);
    expect(element.isolateScope().resizeElements).toHaveBeenCalled();
  }));

  describe('Mousedown event', function(){
    it('should call prevent default when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1, preventDefault: function(){}};
      spyOn(event, 'preventDefault');
      element.triggerHandler(event);
      expect(event.preventDefault).toHaveBeenCalled();
    }));

    it('should attach a mousemove handler when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1};
      spyOn($document, 'on');
      element.triggerHandler(event);
      expect($document.on).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    }));

    it('should attach a mouseup handler when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1};
      spyOn($document, 'on');
      element.triggerHandler(event);
      expect($document.on).toHaveBeenCalledWith('mouseup', jasmine.any(Function));
    }));

    it('shouldn\'t call prevent default when mouse button is 2', inject(function() {
      var event = {type: 'mousedown', button: 2, preventDefault: function(){}};
      spyOn(event, 'preventDefault');
      element.triggerHandler(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    }));
  });

  describe('resizeElements function', function(){
    beforeEach(function(){
      leftSpy = jasmine.createSpy('left css');
      rightSpy = jasmine.createSpy('right css');
      spyOn(isolateScope, 'applyClasses');
      element.isolateScope().leftTargetElement = {css: leftSpy};
      element.isolateScope().rightTargetElement = {css: rightSpy};
    });

    it('should shrink the left element if mouseX is smaller', inject(function() {
      element.isolateScope().resizeElements(200, 600, 100);
      expect(leftSpy).toHaveBeenCalledWith('width', '100px');
    }));

    it('should move the right element to match the left element\s edge if mouseX is smaller ', inject(function() {
      element.isolateScope().resizeElements(200, 600, 100);
      expect(rightSpy).toHaveBeenCalledWith('width', '700px');
    }));

    it('should grow the left element if mouseX is larger', inject(function() {
      element.isolateScope().resizeElements(200, 600, 500);
      expect(leftSpy).toHaveBeenCalledWith('width', '500px');
    }));

    it('should move the right element to match the left element\s edge if mouseX is larger ', inject(function() {
      element.isolateScope().resizeElements(200, 600, 500);
      expect(rightSpy).toHaveBeenCalledWith('width', '300px');
    }));

    it('should do nothing if the new right width is less than the min width of the right element', inject(function() {
      element.isolateScope().rightTargetElement.css = jasmine.createSpy('css').and.returnValue('700px');
      element.isolateScope().resizeElements(200, 600, 500);
      expect(rightSpy).not.toHaveBeenCalledWith('width', jasmine.any(String));
      expect(leftSpy).not.toHaveBeenCalledWith('width', jasmine.any(String));
    }));

    it('should do nothing if the new left width is less than the min width of the left element', inject(function() {
      element.isolateScope().leftTargetElement.css = jasmine.createSpy('css').and.returnValue('700px');
      element.isolateScope().resizeElements(200, 600, 100);
      expect(rightSpy).not.toHaveBeenCalledWith('width', jasmine.any(String));
      expect(leftSpy).not.toHaveBeenCalledWith('width', jasmine.any(String));
    }));
  });

  describe ('applyClasses function', function(){
    it('should add the two-col class when width is larger than 700', inject(function() {
      var ele = angular.element('<div></div>');
      isolateScope.applyClasses({rightWidth: 800}, ele, 'rightWidth');
      expect(ele.hasClass('two-col')).toBeTruthy();
    }));

    it('should remove the two-col class when width is less than or equal to 700', inject(function() {
      var ele = angular.element('<div></div>');
      ele.addClass('two-col');
      isolateScope.applyClasses({rightWidth: 700}, ele, 'rightWidth');
      expect(ele.hasClass('two-col')).toBeFalsy();

      ele.addClass('two-col');
      isolateScope.applyClasses({rightWidth: 500}, ele, 'rightWidth');
      expect(ele.hasClass('two-col')).toBeFalsy();
    }));

    it('should add the compact-view class when width is less than 450', inject(function() {
      var ele = angular.element('<div></div>');
      isolateScope.applyClasses({rightWidth: 300}, ele, 'rightWidth');
      expect(ele.hasClass('compact-view')).toBeTruthy();
    }));

    it('should remove the compact-view class when width is greater than or equal to 450', inject(function() {
      var ele = angular.element('<div></div>');

      ele.addClass('compact-view');
      isolateScope.applyClasses({rightWidth: 500}, ele, 'rightWidth');
      expect(ele.hasClass('compact-view')).toBeFalsy();

      ele.addClass('compact-view');
      isolateScope.applyClasses({rightWidth: 450}, ele, 'rightWidth');
      expect(ele.hasClass('compact-view')).toBeFalsy();
    }));
  });

  describe ('mouseUp function', function(){
    it('should unbind the mousemove listener', inject(['$document', function($document) {
      spyOn($document, 'unbind');
      isolateScope.mouseup();
      expect($document.unbind).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    }]));

    it('should unbind the mouseup listener', inject(['$document', function($document) {
      spyOn($document, 'unbind');
      isolateScope.mouseup();
      expect($document.unbind).toHaveBeenCalledWith('mouseup', jasmine.any(Function));
    }]));
  });
});
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
      templateUrl: 'app/shared/directives/numberSlider/numberSlider.html',
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

/*global jQuery : false */

describe('numberSlider directive', function(){
  var $scope,
    element,
    isolateScope,
    doCompile;
  
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular')); 
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));
  
  beforeEach(inject(['$compile', '$rootScope', function($compile,_$rootScope_) {
    $scope = _$rootScope_.$new();
    
    $scope.value = null;
    $scope.placeholder = 'enter a value';
    $scope.hasHandles = true;
    
    doCompile = function(){
      element = $compile('<number-slider value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should add an input', inject(function() {
    doCompile();
    expect(element.find('input').length).toEqual(1);
  }));
  
  it('should set min and max values to null if not defined', inject(function() {
    doCompile();
    
    expect(isolateScope.minValue).toBeNull();
    expect(isolateScope.maxValue).toBeNull();
  }));
  
  describe('value watch', function(){
    it('should convert string to number', inject(function() {
      doCompile();
      
      $scope.value = 'v44';
      $scope.$digest();
      expect($scope.value).toEqual(44);
      
      $scope.value = '3';
      $scope.$digest();
      expect($scope.value).toEqual(3);
      
      $scope.value = '     3';
      $scope.$digest();
      expect($scope.value).toEqual(3);
    }));
    
    it('should allow negative numbers', inject(function() {
      doCompile();
      
      $scope.value = '-3';
      $scope.$digest();
      expect($scope.value).toEqual(-3);
    }));
    
    it('should allow floating point numbers', inject(function() {
      doCompile();
      
      $scope.value = '4.2';
      $scope.$digest();
      expect($scope.value).toEqual(4.2);
    }));
    
    it('should enforce the max value', inject(['$compile', function($compile) {
      $scope.maxValue = 5;
      $scope.value = 10;
      element = $compile('<number-slider min-value="{{minValue}}" max-value="{{maxValue}}" value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      expect($scope.value).toEqual(5);
      
      $scope.value = 30;
      $scope.$digest();
      expect($scope.value).toEqual(5);
    }]));
    
    it('should enforce the min value', inject(['$compile', function($compile) {
      $scope.minValue = 0;
      $scope.value = -1;
      
      element = $compile('<number-slider min-value="{{minValue}}" max-value="{{maxValue}}" value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      
      expect($scope.value).toEqual(0);
      
      $scope.value = -15;
      $scope.$digest();
      expect($scope.value).toEqual(0);
    }]));
  });
  
  describe('increment function', function(){
    it('should increase value by 1', inject(function() {
      doCompile();

      isolateScope.value = 1;
      isolateScope.increment();
      expect(isolateScope.value).toEqual(2);
    }));
    
    it('should set value to 0 if it is null and no minvalue given', inject(function() {
      doCompile();
      
      isolateScope.value = null;
      isolateScope.increment();
      expect(isolateScope.value).toEqual(0);
    }));
    
    it('should set value to minValue if value is null', inject(function($compile) {
      element = $compile('<number-slider min-value="-1" value="value"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      isolateScope.increment();
      isolateScope.$digest();
      expect(isolateScope.value).toEqual(-1);
    }));
    
    it('should not increment value if value is already maxValue', inject(function($compile) {
      element = $compile('<number-slider max-value="10" value="value"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      isolateScope.value = 10;
      isolateScope.increment();
      expect(isolateScope.value).toEqual(10);
    }));
  });
  
  describe('decrement function', function(){
    it('should decrease value by 1', inject(function() {
      doCompile();
      
      isolateScope.value = '1';
      isolateScope.decrement();
      expect(isolateScope.value).toEqual(0);
    }));
    
    it('should set value to 0 if it is null', inject(function() {
      doCompile();
      
      isolateScope.value = null;
      isolateScope.decrement();
      expect(isolateScope.value).toEqual(0);
    }));
    
    it('should set value to minValue if value is null', inject(function($compile) {
      element = $compile('<number-slider min-value="-1" value="value"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      isolateScope.decrement();
      isolateScope.$digest();
      expect(isolateScope.value).toEqual(-1);
    }));
    
    it('should not decrease value if value is already minValue', inject(function($compile) {
      element = $compile('<number-slider min-value="10" value="value"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      isolateScope.value = 10;
      isolateScope.decrement();
      expect(isolateScope.value).toEqual(10);
    }));
  });
  
  describe('keypress event handler', function(){
    it('should call decrement on keydown', inject(function($timeout) {
      doCompile();
      
      spyOn(isolateScope, 'decrement');
      
      var event = jQuery.Event('keydown');
      event.which = 40;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.decrement).toHaveBeenCalled();
    }));
    
    it('should call increment on keyup', inject(function($timeout) {
      doCompile();
      
      spyOn(isolateScope, 'increment');
      
      var event = jQuery.Event('keydown');
      event.which = 38;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.increment).toHaveBeenCalled();
    }));
  });
});

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

describe('separateValidation directive', function(){
  var $scope,
    $compile,
    element,
    controller,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    
    //Reset between tests
    controller = null;
    element = null;
    
    doDefaultCompile = function(){
      element = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form" separate-validation><input name="innerInput" ng-required="true" ng-model="innerInput"></input></ng-form></ng-form>')($scope);
      controller = angular.element(element.find('ng-form')[0]).controller('form');
    };
  }]));
  
  it('should remove the subform from the parent controller', function() {
    var normalElement = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form"><input name="inner-input"></input></ng-form></ng-form>')($scope);
    var normalController = normalElement.controller('form');
    expect(normalController['inner-form']).toBeDefined();
    
    element = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form" separate-validation><input name="inner-input"></input></ng-form></ng-form>')($scope);
    var separatedController = element.controller('form');
    expect(separatedController['inner-form']).not.toBeDefined();
  });
  
  it('should do nothing if not applied to a form', function() {
    element = $compile('<ng-form name="first-form"><input separate-validation name="input-one"></input></ng-form>')($scope);
    var formController = element.controller('form');
    expect(formController.$addControl).not.toEqual(angular.noop);
    expect(formController.$removeControl).not.toEqual(angular.noop);
  });
  
  describe('setValidity function', function(){
    it('should set invalid if field is required and not supplied', function() {
      doDefaultCompile();
      $scope.$digest();
      controller.$setValidity();
      expect(controller.$invalid).toBeTruthy();
    });
    
    it('should set invalid to false if field is required and supplied', function() {
      doDefaultCompile();
      $scope.$digest();
      controller.innerInput.$error = {required : false};
      controller.$setValidity();
      expect(controller.$invalid).toBeFalsy();
    });
  });
  
  describe('setDirty function', function(){
    it('should set the dirty flag to true', function() {
      doDefaultCompile();
      expect(controller.$dirty).toBeFalsy();
      controller.$setDirty();
      expect(controller.$dirty).toBeTruthy();
    });
  });
  
  describe('setPristine function', function(){
    it('should set the pristine', function() {
      doDefaultCompile();
      expect(controller.$pristine).toBeTruthy();
      controller.$setPristine(false);
      expect(controller.$pristine).toBeFalsy();
      controller.$setPristine(true);
      expect(controller.$pristine).toBeTruthy();
    });
  });
});
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
      templateUrl : 'app/shared/directives/singleElementResizeHandle/singleElementResizeHandle.html',
      link : function($scope, $element) {
        $scope.targetElement = angular.element(document.getElementById($scope.elementId));

        $element.on('mousedown', function() {
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
  .directive('tableCell', [
    function () {
      return {
        scope: {
          item: '=',
          name: '@'
        },
        link: function ($scope, $element, $attrs, controller, $transclude) {
          var innerScope = $scope.$new();
          $transclude(innerScope, function (clone) {
            $element.empty();
            
            angular.forEach(clone, function(include) {
              if (include.attributes &&
                include.attributes.name &&
                include.attributes.name.value === $scope.name){
                $element.append(include);
              }
            });
            $element.on('$destroy', function () {
              innerScope.$destroy();
            });
          });
        }
      };
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('tableControls', ['$rootScope', '$filter', '$location', '$stateParams', '$parse', 'DirtyForms', 'Session',
    function ($rootScope, $filter, $location, $stateParams, $parse, DirtyForms, Session) {
      return {
        restrict: 'E',
        scope: {
          id: '@',
          config: '=',
          items: '=',
          selected: '=',
          extendScope: '=',
          resourceName: '@'
        },
        templateUrl: 'app/shared/directives/tableControls/tableControls.html',
        transclude: true,
        controller: function () {},
        link: function ($scope) {
          $scope.primaryKey = $scope.config.primaryKey ?
            $scope.config.primaryKey : 'id';
          
          $scope.$watch('config', function(){
            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.showCreate = angular.isDefined($scope.config.showCreate) ? $scope.config.showCreate : true;
            
            $scope.reverseSortOrder = false;
            $scope.orderBy = $scope.config.orderBy;
          });
          
          angular.extend($scope, $scope.extendScope);
          
          $scope.$on('created:resource:' + $scope.resourceName,
            function (event, item) {
              $scope.selected = item;
              $location.search({
                id: item.id
              });
          });

          $scope.$on('dropdown:item:checked', function (){
            var columnPreferences = Session.columnPreferences;
            columnPreferences[$scope.config.title] = $scope.config.fields;
            Session.setColumnPreferences(columnPreferences);
          });

          $scope.onCreateClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $rootScope.$broadcast('table:on:click:create');
            });
          };

          $scope.onActionsClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.selected = undefined;
              $rootScope.$broadcast('table:on:click:actions');
            });
          };

          $scope.selectItem = function (item) {
            DirtyForms.confirmIfDirty(function () {
              $scope.selected = item;

              if (item) {
                $location.search({
                  id: item.id
                });
              }

              $rootScope.$broadcast('table:resource:selected', item);
            });
          };

          $scope.checkItem = function (item, value) {
            var newValue = angular.isDefined(value) ? value : !item.checked;

            if (item.checked !== newValue) {
              item.checked = newValue;
              $rootScope.$broadcast('table:resource:checked', item);
            }
          };

          $scope.parse = function (item, field) {
            if (field.resolve) {
              return field.resolve(item);
            } else if (field.name) {
              var parseFunc = $parse(field.name);
              return parseFunc(item);
            }
          };

          $scope.toggleAll = function (checkedValue) {
            angular.forEach($scope.filtered, function (item) {
              $scope.checkItem(item, checkedValue);
            });
          };

          //TODO: Run this again if the selected tenant changes?
          if ($scope.items) {
            $scope.items.$promise.then(function () {
              if ($scope.items.length === 0) {
                $rootScope.$broadcast('resource:create');
              } else if ($stateParams.id) {
                //Init the selected item based on URL param
                var matchedItems = $filter('filter')($scope.items, {
                  id: $stateParams.id
                }, true);
                if (matchedItems.length > 0) {
                  $scope.selectItem(matchedItems[0]);
                  return;
                } else {
                  $scope.selected = $scope.selectItem(null);
                }
              }
            });
          }

          $scope.$watchCollection('filtered', function () {
            if (!$scope.items || !$scope.items.$resolved) {
              $scope.selectItem(null);
              return;
            }

            if ($scope.filtered.length === 0) {
              $rootScope.$broadcast('resource:create');
              return;
            }

            //Swap the selection if the selected item gets filtered out
            var selectedIsVisible = false;
            if ($scope.selected) {
              var matchedItems = $filter('filter')($scope.filtered, {
                id: $scope.selected.id
              }, true);
              if (matchedItems.length > 0) {
                selectedIsVisible = true;
              }
            }

            if (!selectedIsVisible) {
              $scope.selectItem(null);
            }

            //Uncheck rows that have been filtered out
            angular.forEach($scope.items, function (item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
                item.checked = false;
              }
            });
          });

          $scope.sortTable = function (field) {
            var fieldName;
            if (field.sortOn) {
              fieldName = field.sortOn;
            } else if (field.name) {
              fieldName = field.name;
            }

            if (fieldName === $scope.orderBy) {
              $scope.reverseSortOrder = !$scope.reverseSortOrder;
            } else {
              $scope.reverseSortOrder = false;
            }

            $scope.orderBy = fieldName;
          };
          
          $scope.clearAllFilters = function(){
            $scope.searchQuery = null;
            
            angular.forEach($scope.config.fields, function(field){
              if (field.header.options){
                var options = $filter('invoke')(field.header.options);
                angular.forEach(options, function(option){
                  option.checked = false;
                });
              }
            });
          };

          $scope.getFields = function(){

            for (var fieldIndex = 0; fieldIndex < $scope.config.fields.length; fieldIndex++) {
              if (Session.columnPreferences[$scope.config.title]) {
                for (var storeOptionIndex = 0; storeOptionIndex < Session.columnPreferences[$scope.config.title].length; storeOptionIndex++) {
                  var storedOption = Session.columnPreferences[$scope.config.title][storeOptionIndex];
                  if ($scope.config.fields[fieldIndex].header.display === storedOption.header.display) {
                    $scope.config.fields[fieldIndex].checked = (angular.isUndefined(storedOption.checked) ? true : storedOption.checked);
                  }
                }
              }
            }

            return $scope.config.fields;
          };
        }
      };
    }
  ]);

'use strict';

/*global jasmine, spyOn: false */

describe('tableControls directive', function () {
  var $scope,
    $stateParams,
    element,
    isolateScope,
    doCompile;

  beforeEach(module('liveopsConfigPanel.shared.directives'));

  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams',
    function ($compile, $rootScope, _$stateParams_) {
      $scope = $rootScope.$new();
      $stateParams = _$stateParams_;

      $scope.config = {
        fields: [{
          name: 'id'
        }],
        searchOn: ['id']
      };
      $scope.selected = {};
      $scope.resourceName = 'resource';
      $scope.extendScope = {};
      $scope.id = 'my-table';
      $scope.items = [];
      $scope.items.$promise = {
        then: function (callback) {
          callback();
        }
      };
      $scope.items.$resolved = true;

      doCompile = function () {
        element = $compile('<table-controls items="items" config="config" selected="selected" resource-name="{{resourceName}}" extend-scope="extendScope" id="id"></table-controls>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should create a table', inject(function () {
    doCompile();
    expect(element.find('table').length).toEqual(2); //Two tables are present due to scroll-table directive
  }));

  it('should add extendscope to its own scope', inject(function () {
    $scope.extendScope = {
      'newProperty': 'neat'
    };
    doCompile();
    expect(isolateScope.newProperty).toBeDefined();
    expect(isolateScope.newProperty).toEqual('neat');
  }));

  it('should select item based on url param', inject(function () {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    $stateParams.id = 'item2';
    doCompile();
    expect($scope.selected).toEqual($scope.items[1]);
  }));

  it('should not try to select item based on url param if no items', inject(function () {
    var itemsSpy = spyOn($scope.items.$promise, 'then');
    delete $scope.items;
    doCompile();
    expect(itemsSpy).not.toHaveBeenCalled();
  }));

  it('should not select an item if id in url params does not match any item', inject(function () {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    $stateParams.id = 'somethingelse';
    doCompile();
    expect($scope.selected).toEqual(null);
  }));

  it('should select nothing on init if there is no id param', inject(function () {
    delete $stateParams.id;
    $scope.selected = null;
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    doCompile();
    expect($scope.selected).toEqual(null);
  }));

  it('should not display columns that are unchecked in config', inject(function () {
    $scope.config.fields.push({
      name: 'color',
      checked: false
    });
    $scope.config.fields.push({
      name: 'online',
      checked: true
    });
    doCompile();
    expect(element.find('th').length).toBe(3 * 2); //Two shown, one hidden, one checkbox column. Doubled due to scroll-table directive...
  }));

  it('should include a filter dropdown if field config has options defined', inject(function () {
    $scope.config.fields.push({
      name: 'color',
      header: {
        options: [{
          'display': 'Disabled',
          'value': 'disabled'
        }, {
          'display': 'Enabled',
          'value': 'enabled'
        }, {
          'display': 'Pending',
          'value': 'pending'
        }]
      }
    });
    doCompile();
    expect(element.find('table').find('filter-dropdown').length).toBe(2); //Doubled due to scroll-table directive
  }));
  
  it('should catch the created:resource event and select the newly created item', inject(['$rootScope', function ($rootScope) {
    doCompile();
    var newItem = {id: 'myNewItem'};
    $rootScope.$broadcast('created:resource:resource', newItem);
    
    isolateScope.$digest();
    expect(isolateScope.selected).toEqual(newItem);
  }]));

  describe('selectItem function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.selectItem).toBeDefined();
      expect(isolateScope.selectItem).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.selectItem();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));


    it('should set selected', inject(function () {
      isolateScope.selectItem({
        name: 'my new item'
      });
      $scope.$digest();
      expect($scope.selected.name).toEqual('my new item');
    }));

    it('should call location to update the query param', inject(['$location', function ($location) {
      spyOn($location, 'search');
      isolateScope.selectItem({
        id: 'id1'
      });
      expect($location.search).toHaveBeenCalledWith({
        id: 'id1'
      });

      $location.search.calls.reset();
      isolateScope.selectItem();
      expect($location.search).not.toHaveBeenCalled();

      $location.search.calls.reset();
      isolateScope.selectItem({
        something: 'blah'
      });
      expect($location.search).toHaveBeenCalledWith({
        id: undefined
      });
    }]));

    it('should emit the resource:selected event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.selectItem({
        name: 'my item'
      });
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:resource:selected', {
        name: 'my item'
      });
    }]));
  });
  
  describe('onCreateClick function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.onCreateClick).toBeDefined();
      expect(isolateScope.onCreateClick).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onCreateClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));

    it('should emit the table create click event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onCreateClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:on:click:create');
    }]));
  });
  
  describe('onActionsClick function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.onActionsClick).toBeDefined();
      expect(isolateScope.onActionsClick).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onActionsClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));

    it('should emit the table actions click event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onActionsClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:on:click:actions');
    }]));
  });

  describe('toggleAll function', function () {
    beforeEach(function () {
      $scope.items.push({
        id: 'item1',
        checked: false
      });
      $scope.items.push({
        id: 'item2',
        checked: true
      });
      $scope.items.push({
        id: 'item3'
      });
      doCompile();
    });

    it('should set all filtered items to checked when param is true', inject(function () {
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeTruthy();
    }));

    it('should set all filtered items to unchecked when param is false', inject(function () {
      isolateScope.toggleAll(false);
      expect($scope.items[0].checked).toBeFalsy();
      expect($scope.items[1].checked).toBeFalsy();
      expect($scope.items[2].checked).toBeFalsy();
    }));

    it('should only apply to filtered items', inject(function () {
      isolateScope.filtered.removeItem($scope.items[2]);
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeFalsy();
    }));
  });

  describe('filtered', function () {
    beforeEach(function () {
      $scope.items.push({
        id: 'item1',
        checked: false
      });
      $scope.items.push({
        id: 'item2',
        checked: true
      });
      $scope.items.push({
        id: 'item3'
      });
      doCompile();
    });

    it('should update when searchQuery changes', inject(function () {
      isolateScope.searchQuery = 'item2';
      isolateScope.$digest();
      expect(isolateScope.filtered.length).toBe(1);
      expect(isolateScope.filtered[0].id).toEqual('item2');
    }));

    it('watch should set selected item to null if there isn\'t one', inject(function () {
      spyOn(isolateScope, 'selectItem');
      delete isolateScope.selected;
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith(null);
    }));

    it('watch should reset selected item if old one gets filtered', inject(function () {
      spyOn(isolateScope, 'selectItem');
      isolateScope.selected = $scope.items[2];
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith(null);
    }));

    it('watch should uncheck items that have been filtered out', inject(function () {
      isolateScope.searchQuery = 'item3';
      isolateScope.$digest();
      expect($scope.items[1].checked).toBeFalsy();
    }));
  });

  describe('parse function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should exist', inject(function () {
      expect(isolateScope.parse).toBeDefined();
      expect(isolateScope.parse).toEqual(jasmine.any(Function));
    }));

    it('should call and return field.name if field.name is a function', inject(function () {
      var item = {
        entity: 'the Hypnotoad'
      };
      var field = {
        name: function (item) {
          return 'All Glory to ' + item.entity;
        }
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('All Glory to the Hypnotoad');
    }));

    it('should return the field value if field.name is a string', inject(function () {
      var item = {
        bob: 'yes'
      };
      var field = {
        name: 'bob'
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('yes');
    }));

    it('should do nothing if field name is a type other than string or function', inject(function () {
      var result;
      var field;
      var item = {
        bob: 'yes'
      };

      field = {
        name: false
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: []
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: {}
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: 11
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();
    }));
    
    it('should call resolve function if it is defined', inject(function () {
      var item = {
        bob: 'yes'
      };

      var field = {
        resolve: jasmine.createSpy('resolve').and.returnValue('spyResult')
      };
      var result = isolateScope.parse(item, field);
      expect(field.resolve).toHaveBeenCalledWith(item);
      expect(result).toEqual('spyResult');
    }));
  });

  describe('sortTable function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should exist', inject(function () {
      expect(isolateScope.sortTable).toBeDefined();
      expect(isolateScope.sortTable).toEqual(jasmine.any(Function));
    }));

    it('should toggle reverseSortOrder if the orderBy field is already the given field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    }));

    it('should toggle reverseSortOrder if the orderBy field is already the given field\'s sortOn value', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    }));

    it('should set orderBy and reset reverseSortOrder if it is a newly chosen field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    }));

    it('should set orderBy to the field\'s sortOn value and reset reverseSortOrder if it is a newly chosen field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    }));
  });
  
  describe('clearAllFilters function', function () {
    beforeEach(function () {
      doCompile();
      
      $scope.config.fields = [{
        header: {id: 'one'}
      }, {
        header: {id: 'two'}
      }];
    });

    it('should exist', inject(function () {
      expect(isolateScope.clearAllFilters).toBeDefined();
      expect(isolateScope.clearAllFilters).toEqual(jasmine.any(Function));
    }));

    it('should clear the search field', inject(function () {
      isolateScope.clearAllFilters();
      expect(isolateScope.searchQuery).toBeNull();
    }));
    
    it('should deselect all filters, if provided', inject(function () {
      isolateScope.config.fields[0].header.options = [{
        id: 'option1',
        checked: true
      }, {
        id: 'option2'
      }, {
        id: 'option3',
        checked: false
      }];
      
      isolateScope.clearAllFilters();
      
      expect(isolateScope.config.fields[0].header.options[0].checked).toBeFalsy();
      expect(isolateScope.config.fields[0].header.options[1].checked).toBeFalsy();
      expect(isolateScope.config.fields[0].header.options[2].checked).toBeFalsy();
    }));

  });
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('confirmToggle', ['Modal', '$timeout', function(Modal, $timeout) {
    return {
      require: ['ngModel', '^toggle'],
      link: function ($scope, $element, $attrs, controllers) {
        controllers[0].$parsers.push(function (newValue) {
          return $scope.onToggle(newValue);
        });
        
        $scope.onToggle = function(newValue){
          $timeout(function(){ //For display until confirm dialog value is resolved
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

describe('confirmToggleDirective', function(){
  var $scope,
    element,
    $q;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$q', function($compile, $rootScope, _$q_) {
    $q = _$q_;
    $scope = $rootScope.$new();
    
    $scope.model = false;
    
    $scope.bool = false;
    
    element = $compile('<toggle confirm-toggle ng-model="model" confirm-enable-message="Are you sure?" confirm-disable-message="Really sure"?></toggle>')($scope);
    $scope.$digest();
  }]));
  
  describe('onToggle function', function(){
    it('should show a confirm modal if toggled to false', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.resolve('true');
        return deferred.promise;
      });
      
      $scope.onToggle(false);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should show a confirm modal if toggled to true', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.resolve('true');
        return deferred.promise;
      });
      
      $scope.onToggle(true);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should toggle ngModel as false if user clicks ok on the modal', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      
      var deferred = $q.defer();
      deferred.resolve('true');
      spyOn(Modal, 'showConfirm').and.returnValue(deferred.promise);
      
      $scope.ngModel = false;
      $scope.onToggle(false);
      expect($scope.ngModel).toBeFalsy();
    }]));
    
    it('should leave ngModel to true if user clicks cancel on the modal', inject(['Modal', '$timeout', function(Modal, $timeout) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.reject('false');
        return deferred.promise;
      });
      
      $scope.falseValue = false;
      $scope.trueValue = true;
      $scope.ngModel = false;
      $scope.onToggle(false);
      $timeout.flush();
      expect($scope.$parent.ngModel).toBeTruthy();
    }]));
  });
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('toggle', [function() {
    return {
      templateUrl : 'app/shared/directives/toggle/toggle.html',
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

describe('toggleDirective', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    $scope.model = false;
    
    $scope.bool = false;
    
    element = $compile('<toggle ng-model="model" ng-disabled="bool"></toggle>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));
  
  it('should do something', function() {
    expect(isolateScope.ngModel).toBe($scope.model);
    expect(isolateScope.ngDisabled).toBe($scope.bool);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('tooltip', ['$document', '$timeout', function ($document, $timeout) {
    return {
      templateUrl: 'app/shared/directives/tooltip/tooltip.html',
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

describe('tooltip directive', function(){
  var $scope,
    isolateScope,
    $compile,
    element,
    $document
    ;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$document', '$timeout', function(_$compile_, $rootScope, _$document_, $timeout) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $document = _$document_;

    var offsetSpy = jasmine.createSpy('offset').and.returnValue({left: 0, top: 0});
    var heightSpy = jasmine.createSpy('height').and.returnValue(10);
    var widthSpy = jasmine.createSpy('width').and.returnValue(15);
    $scope.myItem = {
      offset: offsetSpy,
      outerHeight: heightSpy,
      outerWidth: widthSpy
    };
    
    element = $compile('<tooltip text="my tooltip text" target="myItem"></tooltip>')($scope);
    $scope.$digest();
    $timeout.flush();
    
    isolateScope = element.isolateScope();
  }]));

  it('should render the text', inject(function() {
    expect(element.text()).toEqual('my tooltip text');
  }));
  
  describe('getPositionClass function', function(){
    beforeEach(function(){
      spyOn($document, 'width').and.returnValue(100);
      spyOn($document, 'height').and.returnValue(100);
      isolateScope.tooltipHeight = 20;
      isolateScope.tooltipWidth = 20;
    });
    
    it('should return "bottom right" if element is near top left corner of document', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('bottom right');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('bottom right');
    }));
    
    it('should return "bottom left" if element is near top right corner of document', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('bottom left');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('bottom left');
    }));
    
    it('should return "bottom center" if element is near top of the document and not near a side', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('bottom center');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('bottom center');
    }));
    
    it('should return "top right" if element is near bottom left of the document', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('top right');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('top right');
    }));
    
    it('should return "top left" if element is near bottom right of the document', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('top left');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('top left');
    }));
    
    it('should return "top center" if element is near bottom of the document and not near a side', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
    }));
    
    it('should return "center right" if element is near the left of the document but not near top or bottom', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('center right');
      
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('center right');
    }));
    
    it('should return "center left" if element is near the right of the document but not near top or bottom', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('center left');
      
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('center left');
    }));
    
    it('should return "top center" if element is not near any edge', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
      
      isolateScope.targetPosition.top = 40;
      isolateScope.targetPosition.left = 70;
      expect(isolateScope.getPositionClass()).toEqual('top center');
    }));
  });
  
  describe('getAbsolutePosition function', function(){
    var arrowHeight = 15;
    var arrowWidth = 13;
    var arrowBase = 25;
    var targetHeight = 10;
    var targetWidth = 15;
    var tooltipHeight = 20;
    var tooltipWidth = 30;
    
    beforeEach(function(){
      isolateScope.tooltipHeight = tooltipHeight;
      isolateScope.tooltipWidth = tooltipWidth;
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 50;
    });
    
    it('should return coordinates to the bottom right of target when given "bottom right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom right');
      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the bottom left of target when given "bottom left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom left');
      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50 - tooltipWidth - arrowWidth);
    }));
    
    it('should return coordinates to the bottom center of target when given "bottom center"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom center');
      expect(position.top).toEqual(50 + targetHeight + arrowHeight);
      
      var targetCenter =  50 + 7.5;
      var tooltipHalfWidth = 15;
      expect(position.left).toEqual(targetCenter - tooltipHalfWidth);
    }));
    
    it('should return coordinates to the top right of target when given "top right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top right');
      expect(position.top).toEqual(50 - tooltipHeight + arrowBase);
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the top left of target when given "top left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top left');
      expect(position.top).toEqual(50 - tooltipHeight + arrowBase);
      expect(position.left).toEqual(50 - tooltipWidth - arrowWidth);
    }));
    
    it('should return coordinates to the top center of target when given "top center"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top center');
      expect(position.top).toEqual(50 - (tooltipHeight + arrowHeight));
      
      var targetCenter =  50 + 7.5;
      var tooltipHalfWidth = 15;
      expect(position.left).toEqual(targetCenter - tooltipHalfWidth);
    }));
    
    it('should return coordinates to the right of target when given "center right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('center right');
      
      var targetCenter =  50 + 5;
      var tooltipHalfHeight = 10;
      expect(position.top).toEqual(targetCenter - tooltipHalfHeight);
      
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the right of target when given "center left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('center left');
      
      var targetCenter =  50 + 5;
      var tooltipHalfHeight = 10;
      expect(position.top).toEqual(targetCenter - tooltipHalfHeight);
      
      expect(position.left).toEqual(50 - (tooltipWidth + arrowWidth));
    }));
    
    it('should return the target elements coordinates when given an unsupported value', inject(function() {
      var position = isolateScope.getAbsolutePosition('center center');

      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50);
      
      position = isolateScope.getAbsolutePosition('foo');

      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50);
    }));
  });
});

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
        selectedItem: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

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

/* global spyOn, jQuery: false */

describe('typeAhead directive', function(){
  var $scope,
    $compile,
    element,
    isolateScope,
    doDefaultCompile,
    $timeout;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$timeout', function(_$compile_, $rootScope, _$timeout_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $timeout = _$timeout_;
    
    $scope.items = [{
      title : 'firstItem', 
      extraProp: 'true',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('firstItem')
    }, {
      title: 'secondItem',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('secondItem')
    }, {
      title: 'secondItemAgain',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('secondItemAgain')
    }, {
      title: 'thirdItem',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('thirdItem')
    }];
    
    $scope.selectedItem = {id: '2'};
    $scope.selectFunction = function(){};
    
    doDefaultCompile = function(){
      element = $compile('<type-ahead items="items" name-field="title" ' +
        'selected-item="selected" on-select="selectFunction()" is-required="required" ' +
        'placeholder="Type here" hover="hover"></type-ahead>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));
  
  it('should set text to empty if the selected item changes to null', function() {
    doDefaultCompile();
    $scope.selectedItem = null;
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });
  
  it('should set item to null if there is no text', function() {
    doDefaultCompile();
    $scope.currentText = '';
    $scope.$digest();
    expect(isolateScope.selectedItem).toBeNull();
  });
  
  it('should set item to null if there is only whitespace', function() {
    doDefaultCompile();
    $scope.currentText = '                 ';
    $scope.$digest();
    expect(isolateScope.selectedItem).toBeNull();
  });
  
  it('should do nothing if selected item changes to an object', function() {
    doDefaultCompile();
    isolateScope.currentText = 'some text';
    $scope.selectedItem = {id : '5'};
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('some text');
  });
  
  describe('currentText watch', function(){
    it('should set selectedItem to the search string if currentText has no matches', function() {
      doDefaultCompile();
      isolateScope.currentText = 'typing some stuff';
      isolateScope.$digest();
      expect(isolateScope.selectedItem).toEqual('typing some stuff');
    });
    
    it('should set selectedItem to the first exact matching item', function() {
      doDefaultCompile();
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      expect(angular.equals(isolateScope.selectedItem, {title : 'firstItem', extraProp: 'true'})).toBeTruthy();
    });
  });
  
  describe('select function', function(){
    it('should set the selected item', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item'});
      expect(isolateScope.selectedItem).toEqual({title : 'new item'});
    });
    
    it('should clear hovering', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item'});
      expect(isolateScope.hovering).toEqual(false);
    });
    
    it('should set the current text to the proper field value is getDisplay is not defined on the selected item', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item', anotherProp : 'Blah'});
      expect(isolateScope.currentText).toEqual('new item');
    });
  });
  
  describe('ON filters watch', function() {
    var controller;
    
    describe('WHEN filters, nameField not supplied', function() {
      beforeEach(function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
      });
      
      it('should have only the defaultTextFilter in fitlerArray WHEN no filters or nameField are given', function() {
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(1);
        
        expect(isolateScope.filterArray[0]).toBe(controller.defaultTextFilter);
      });
    });
    
    describe('WHEN filters supplied and is a function', function() {
      var func1 = function() {
        return;
      };
      
      beforeEach(function() {
        $scope.filters = func1;
      });

      it('should create array with $scope.filters and defaultTextFilter in fitlerArray', function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected" filters="filters"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
        
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(2);
        
        expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).toEqual(-1);
      });
    });
    
    describe('WHEN filters is supplied is and array', function() {
      var func1 = function() {
        return;
      };
      
      var func2 = function() {
        return;
      };
      
      beforeEach(function() {
        $scope.filters = [func1, func2];
      });

      it('should create array with $scope.filters merged with defaultTextFilter in fitlerArray', function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected" filters="filters"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
        
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(3);
        
        expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(func2)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).toEqual(-1);
      });
    });
  });
  
  describe('keypress event handler', function(){
    it('should call select with highlightedItem on pressing the enter key', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      var highlightedItem = {id: 'highlight'};
      isolateScope.highlightedItem = highlightedItem;
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.select).toHaveBeenCalledWith(highlightedItem);
    }));
    
    it('should call select with currenttext on pressing the enter key if nothing is highlighted', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      isolateScope.currentText = 'some text';
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.select).toHaveBeenCalledWith('some text');
    }));
    
    it('should call onEnter with the highlighted item on pressing the enter key', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      spyOn(isolateScope, 'onEnter');
      var highlightedItem = {id: 'highlight'};
      isolateScope.highlightedItem = highlightedItem;
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.onEnter).toHaveBeenCalledWith({item: highlightedItem});
    }));
    
    it('should call onEnter with the current text on pressing the enter key if nothing is selected', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      spyOn(isolateScope, 'onEnter');
      isolateScope.currentText = 'some text';
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.onEnter).toHaveBeenCalledWith({item: 'some text'});
    }));
    
    it('should highlight the next item on down arrow key, if there are more items', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[0];
      
      var event = jQuery.Event('keydown');
      event.which = 40;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[1]);
    }));
    
    it('should do nothing on down arrow if the current highlight is the last', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[3];
      
      var event = jQuery.Event('keydown');
      event.which = 40;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[3]);
    }));
    
    it('should highlight the previous item on up arrow key, if there are any', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[3];
      
      var event = jQuery.Event('keydown');
      event.which = 38;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[2]);
    }));
    
    it('should do nothing on up arrow if the current highlight is the first', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[0];
      
      var event = jQuery.Event('keydown');
      event.which = 38;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[0]);
    }));
  });
  
  describe('onBlur function', function(){
    it('should set showSuggestions to false', inject(function() {
      doDefaultCompile();
      
      isolateScope.showSuggestions = true;
      isolateScope.keepExpanded = false;
      
      isolateScope.onBlur();
      
      expect(isolateScope.showSuggestions).toBeFalsy();
    }));
    
    it('should do nothing if keeyExpanded is true', inject(function() {
      doDefaultCompile();
      
      isolateScope.showSuggestions = true;
      isolateScope.keepExpanded = true;
      
      isolateScope.onBlur();
      
      expect(isolateScope.showSuggestions).toBeTruthy();
    }));
  });
});
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

'use strict';

describe('uuidValidator directive', function(){
  var $scope,
    element
    ;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    element = $compile('<input type="text" uuid ng-model="mymodel"/>')($scope);
    $scope.$digest();
  }]));

  it('should set a uuid validator on the ngModel controller', inject(function() {
    expect(element.controller('ngModel').$validators.uuid).toBeDefined();
  }));
  
  it('should consider an empty model to be valid', inject(function() {
    expect(element.controller('ngModel').$validators.uuid()).toBeTruthy();
  }));
  
  it('should return true if the view value is a valid UUID format', inject(function() {
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '457f4900-b017-45ea-b306-b2c9f3527439')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('00000000-0000-1000-a000-000000000000', '00000000-0000-1000-a000-000000000000')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA', 'AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa')).toBeTruthy();
  }));
  
  it('should return false if the view value is not a valid UUID format', inject(function() {
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', 'some stuff')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', 'AAAAAAAAAAAA1AAAAAAAAAAAAAAAAAAA')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '1234567')).toBeFalsy();
  }));
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('unsavedChangesWarning', ['DirtyForms', '$rootScope', '$window', 'Alert', '$translate',
                                       function (DirtyForms, $rootScope, $window, Alert, $translate) {
    return {
      restrict: 'A',
      require: '?form',
      link: function link($scope, element, attrs, formController) {

        if (! formController) {
          return;
        }

        $scope.destroyStateListener = $rootScope.$on('$stateChangeStart', function(event){
          if (formController.$dirty){
            Alert.confirm($translate.instant('unsavedchanges.nav.warning'),
                angular.noop,
                function() {
                  event.preventDefault();
                }
            );
          }
        });

        $window.onbeforeunload = function(){
          if (formController.$dirty){
            return $translate.instant('unsavedchanges.reload.warning');
          }
        };

        DirtyForms.registerForm(formController);

        $scope.$on('$destroy', function() {
          DirtyForms.removeForm(formController);
          $scope.destroyStateListener();
        });
      }
    };
  }]);

'use strict';

/* global jasmine, spyOn: false */
describe('unsavedChangesWarning directive', function() {
  var $scope,
    element,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    doDefaultCompile = function(){
      element = $compile('<ng-form name="detailsForm" unsaved-changes-warning></ng-form>')($scope);
      $scope.$digest();
    };
  }]));
  
  it('should register the form with the DirtyForms service', inject(['DirtyForms', function(DirtyForms) {
    spyOn(DirtyForms, 'registerForm');
    doDefaultCompile();
    expect(DirtyForms.registerForm).toHaveBeenCalled();
  }]));
  
  it('should do nothing if there is no form controller', inject(['DirtyForms', '$compile', function(DirtyForms, $compile) {
    spyOn(DirtyForms, 'registerForm');
    element = $compile('<div unsaved-changes-warning></div>')($scope);
    $scope.$digest();
    expect(DirtyForms.registerForm).not.toHaveBeenCalled();
  }]));
  
  it('should unregister the form from the DirtyForms service when destroyed', inject(['DirtyForms', function(DirtyForms) {
    doDefaultCompile();
    var removeSpy = spyOn(DirtyForms, 'removeForm');
    $scope.$destroy();
    expect(removeSpy).toHaveBeenCalled();
  }]));
  

  it('should unregister the state listener when destroyed', inject([function() {
    doDefaultCompile();
    var removeSpy = spyOn($scope, 'destroyStateListener');
    $scope.$destroy();
    expect(removeSpy).toHaveBeenCalled();
  }]));
  
  describe('$stateChangeStart handler', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should popup a confirm alert if the form is dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      $scope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}}); //Event params are checked by auth/routeSecurity.js
      expect(Alert.confirm).toHaveBeenCalled();
    }]));
    
    it('should do nothing and allow the state change to happen on ok', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });
      
      spyOn(angular, 'noop');
      $scope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(angular.noop).toHaveBeenCalled();
    }]));
    
    it('should prevent the event on cancel', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        cancelCallback();
      });
      
      $scope.detailsForm.$dirty = true;
      var event = $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      
      expect(event.defaultPrevented).toBeTruthy();
    }]));
    
    it('should do nothing if the form is not dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      $scope.detailsForm.$dirty = false;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(Alert.confirm).not.toHaveBeenCalled();
    }]));
  });
  
  describe('onbeforeunload function', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should set $window.onbeforeunload', inject(['$window', function($window) {
      expect($window.onbeforeunload).toBeDefined();
      expect($window.onbeforeunload).toEqual(jasmine.any(Function));
    }]));
    
    it('should set a message if the form is dirty', inject(['$window', function($window) {
      $scope.detailsForm.$dirty = true;
      expect($window.onbeforeunload()).toEqual(jasmine.any(String));
    }]));
    
    it('should do nothing if the form isn\'t dirty', inject(['$window', function($window) {
      $scope.detailsForm.$dirty = false;
      expect($window.onbeforeunload()).toBeUndefined();
    }]));
  });
});

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

describe('keysCount filter', function () {
  var filter;

  beforeEach(module('liveopsConfigPanel.shared.filters'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    filter = $filter('keysCount');
  }]));

  it('should return the number of properties on the object', inject(function () {
    var result = filter({});
    expect(result).toBe(0);
    
    result = filter({
      one: 1,
      two: true,
      three: '3',
      four: [4]
    });
    expect(result).toBe(4);
  }));
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

describe('matchesField filter', function () {
  var filter;

  beforeEach(module('liveopsConfigPanel.shared.filters'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    filter = $filter('matchesField');
  }]));

  it('should return undefined if missing paramaters', inject(function () {
    var result = filter();
    expect(result).toBeUndefined();
    
    result = filter([]);
    expect(result).toBeUndefined();
    
    result = filter([], 'field');
    expect(result).toBeUndefined();
    
    result = filter([], '', true);
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a first-level match', inject(function () {
    var item = {
      field: 'a neat value',
      name: 'Sally'
    };
    
    var result = filter(item, 'name', 'Sally');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a first-level match', inject(function () {
    var item = {
      field: 'a neat value',
      name: 'Sally'
    };
    
    var result = filter(item, 'name', 'Markus');
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a nested match', inject(function () {
    var item = {
      field: 'a neat value',
      owner:{
        name: 'Sally'
      }
    };
    
    var result = filter(item, 'owner:name', 'Sally');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a nested match', inject(function () {
    var item = {
      field: 'a neat value',
      owner:{
        name: 'Sally'
      }
    };
    
    var result = filter(item, 'owner:name', 'Markus');
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a deeply nested match', inject(function () {
    var item = {
      owner: {
        contact: {
          city: {
            name: 'fredericton'
          }
        }
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'fredericton');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a deeply nested match', inject(function () {
    var item = {
      owner: {
        contact: {
          city: {
            name: 'fredericton'
          }
        }
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'moncton');
    expect(result).toBeUndefined();
  }));
  
  it('should return undefined if the given item doesn\'t have the nested field', inject(function () {
    var item = {
      owner: {
        contact: '1234567'
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'moncton');
    expect(result).toBeUndefined();
  }));
  
  it('should return the item if the field matches an array value', inject(function () {
    var item = {
      things: [{
        id: 'id1'
      }, {
        id: 'id2'
      }]
    };
    
    var result = filter(item, 'things:id', 'id2');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there is no match in an array value', inject(function () {
    var item = {
      things: [{
        id: 'id1'
      }, {
        id: 'id2'
      }]
    };
    
    var result = filter(item, 'things:id', 'some other string');
    expect(result).toBeUndefined();
  }));
});
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

describe('search filter', function () {
  var filter,
    users;

  beforeEach(module('liveopsConfigPanel.shared.filters'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    users = [{
      'id': '3',
      'status': false,
      'state': 'WRAP',
      'lastName': 'Wazowski',
      'firstName': 'Mike',
      'email': 'mike.Wazowski@hivedom.org',
      'skills': [{
        'name': 'walking'
      }, {
        'name': 'talking'
      }],
      'test': {
        'array': [{
          'fieldName': 'fieldValue'
        }]
      },
      'text_array': [
        'text1', 'text2'
      ],
      'recur1': [{
        'recur2': [{
          'recur3': [{
            'name': 'youdidit!'
          }]
        }]
      }]
    }];

    filter = $filter('search');

  }]));

  it('should return all items if search is blank', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '');
    expect(result.length).toBe(1);
  }));

  it('should return all items if fields are blank', inject(function () {
    var result = filter(users, null, 'ssssss');
    expect(result.length).toBe(1);
  }));

  it('should not return item if search not included in item\'s values', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'blahh');
    expect(result.length).toBe(0);
  }));

  it('should return item if search is included in first given field', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'ike');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in multiple given fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Mike Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in last given field', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'ski');
    expect(result.length).toBe(1);
  }));

  it('should not return if only part search is included in item fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Michael Wazowski');
    expect(result.length).toBe(0);
  }));

  it('should return item if search has wildcard value only', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*');
    expect(result.length).toBe(1);
  }));

  it('should return item with containing partial string using wildcard in query', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Mi*Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should only return item containing partial strings using several wildcards in query', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'i*e*a');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'i*l*e*a');
    expect(result.length).toBe(0);
  }));

  it('should return matching item regardless of character case', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'MIKE wAzoWsKi');
    expect(result.length).toBe(1);
  }));

  it('should not return item when search string does not match any fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Randall Boggs');
    expect(result.length).toBe(0);
  }));

  it('should not return item when search string with wild cards does not match any fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*boo*');
    expect(result.length).toBe(0);
  }));

  it('should not use the asterisk as a repeat operator', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'q*');
    expect(result.length).toBe(0);
  }));

  it('should use the asterisk as 0 or more of any valid character', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'M*i*W*a*z*o*i');
    expect(result.length).toBe(1);
  }));

  it('should return the same result regardless of wildcard repeats', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'M*****');
    expect(result.length).toBe(1);
  }));

  it('should return the same result for strings starting and ending with wildcard', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow');
    expect(result.length).toBe(1);
  }));
  
  it('should return nothing if fields aren\'t object or strings', inject(function () {
    var result = filter(users, [5, true], 'W');
    expect(result.length).toBe(0);
  }));

  it('should return results when skills match', inject(function () {

    var result = filter(users, [{
      path: 'skills',
      inner: {
        path: 'name'
      }
    }], 'walk');
    expect(result.length).toBe(1);
  }));
  
  it('should return results when skills match', inject(function () {

    var result = filter(users, [{
      path: 'skills',
      inner: {
        path: 'name'
      }
    }], 'walk');
    expect(result.length).toBe(1);
  }));
  
  it('should return results when inner attribute matches', inject(function () {

    var result = filter(users, [{
      path: 'test.array',
      inner: {
        path: 'fieldName'
      }
    }], 'Value');
    expect(result.length).toBe(1);
  }));
  
  it('should not return results when path is incorrect', inject(function () {
    var result = filter(users, [{
      path: 'test.array_z',
      inner: {
        path: 'fieldName'
      }
    }], 'Value');
    expect(result.length).toBe(0);
  }));
  
  it('should return when query in text array', inject(function () {
    var result = filter(users, [{
      path: 'text_array'
    }], 'text');
    expect(result.length).toBe(1);
  }));
  
  it('should not return when query not in text array', inject(function () {
    var result = filter(users, [{
      path: 'text_array'
    }], 'text3');
    expect(result.length).toBe(0);
  }));
  
  it('should return even with 3x recursion', inject(function () {
    var result = filter(users, [{
      path: 'recur1',
      inner: {
        path: 'recur2',
        inner: {
          path: 'recur3',
          inner: {
            path: 'name'
          }
        }
      }
    }], 'youdidit!');
    expect(result.length).toBe(1);
  }));
  
  it('should not return even with 3x recursion because of wrong path', inject(function () {
    var result = filter(users, [{
      path: 'recur1',
      inner: {
        path: 'recur3',
        inner: {
          path: 'recur2',
          inner: {
            path: 'name'
          }
        }
      }
    }], 'youdidit!');
    expect(result.length).toBe(0);
  }));

  describe('on multiple items', function () {
    beforeEach(function () {
      users = [{
        'id': '3',
        'status': 'true',
        'state': 'WRAP',
        'lastName': 'Wazowski',
        'firstName': 'Mike',
        'email': 'mike.Wazowski@hivedom.org',
        'skills': [{
          'name': 'talking'
        }]
      }, {
        'id': '7',
        'status': true,
        'state': 'OFFLINE',
        'lastName': 'Walter',
        'firstName': 'Serge',
        'email': 'serge.walter@example.com',
        'skills': [{
          'name': 'walking'
        }]
      }];
    });

    it('should return multiple results if they match', inject(function () {

      var result = filter(users, ['firstName', 'lastName'], 'w');
      expect(result.length).toBe(2);
    }));

    it('should only return matching results', inject(function () {

      var result = filter(users, ['firstName', 'lastName'], 'se');
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(users[1]);
    }));

    it('should return results matching string and primitive fields', inject(function () {

      var result = filter(users, ['status'], 'tru');
      expect(result.length).toBe(2);
    }));
    
    it('should return one walking users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'walking');
      expect(result.length).toBe(1);
    }));
    
    it('should return one talking users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'talking');
      expect(result.length).toBe(1);
    }));
    
    it('should return two king users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'king');
      expect(result.length).toBe(2);
    }));
    
  });
});
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

describe('selectedOptions filter', function () {
  var $filter,
    users;

  beforeEach(module('liveopsConfigPanel.shared.filters'));

  beforeEach(inject(['$filter', '$rootScope', function (_$filter_) {
    $filter = _$filter_;
    users = [{
      'status': false,
      'state': 'WRAP',
      'value': 4
    }, {
      'status': true,
      'state': 'NOT_READY',
      'value': 5
    }, {
      'status': true,
      'state': 'READY',
      'value': 6
    }, {
      'status': true,
      'state': 'WRAP',
      'value': 4
    }];
  }]));

  it('should return all users if the all values are checked', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: false,
        checked: true
      }, {
        value: true,
        checked: true
      }]
    };
    var result = $filter('selectedOptions')(users, field);

    expect(result.length).toEqual(users.length);
  }));

  it('should return users that match one selected filter', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: false,
        checked: true
      }, {
        value: true,
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one of many selected filters', inject(function () {
    var field = {
      name: 'state',
      options: [{
        value: 'WRAP',
        checked: true
      }, {
        value: 'READY',
        checked: false
      }, {
        value: 'NOT_READY',
        checked: true
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(3);
  }));

  it('should return an empty array if no users match the filters', inject(function () {
    var field = {
      name: 'state',
      options: [{
        value: 'SOMETHINGELSE',
        checked: true
      }, {
        value: 'READY',
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(0);
  }));

  it('should work with string and primitive values in the field', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: true,
        checked: true
      }, {
        value: false,
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(3);
  }));
});

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

describe('selectedTableOptions filter', function () {
  var $filter,
    users;

  beforeEach(module('liveopsConfigPanel.shared.filters'));

  beforeEach(inject(['$filter', '$rootScope', function (_$filter_) {
    $filter = _$filter_;
    users = [{
      'status': false,
      'state': 'WRAP',
      'value': 4
    }, {
      'status': true,
      'state': 'NOT_READY',
      'value': 5
    }, {
      'status': true,
      'state': 'READY',
      'value': 6
    }, {
      'status': true,
      'state': 'WRAP',
      'value': 4
    }];
  }]));

  it('should return all users if the all values are checked', inject(function () {
    var fields = [{
      name: 'status',
      header: {
        options: [{
          value: false,
          checked: true
        }, {
          value: true,
          checked: false
        }]
      }
    }];

    var result = $filter('selectedTableOptions')(users, fields);

    expect(result.length).toEqual(1);
  }));

  
});

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

/*global jasmine, spyOn : false */

describe('Alert service', function(){
  var Alert,
    toastr;
  
  beforeEach(module('liveopsConfigPanel.shared.services'));
  
  beforeEach(inject(['Alert', 'toastr', function(_Alert_, _toastr_) {
    Alert = _Alert_;
    toastr = _toastr_;
  }]));
  
  describe('error function', function(){
    it('should call toastr error', inject(function() {
      spyOn(toastr, 'error');
      Alert.error('message1', 'message2');
      expect(toastr.error).toHaveBeenCalledWith('message1', 'message2');
    }));
  });
  
  describe('success function', function(){
    it('should call toastr success', inject(function() {
      spyOn(toastr, 'success');
      Alert.success('message');
      expect(toastr.success).toHaveBeenCalledWith('message');
    }));
  });
  
  describe('warning function', function(){
    it('should call toastr warning', inject(function() {
      spyOn(toastr, 'warning');
      Alert.warning('message');
      expect(toastr.warning).toHaveBeenCalledWith('message');
    }));
  });
  
  describe('confirm function', function(){
    it('should pop up a window alert', inject(['$window', function($window) {
      spyOn($window, 'confirm');
      Alert.confirm('message');
      expect($window.confirm).toHaveBeenCalledWith('message');
    }]));
    
    it('should call onOk callback', inject(['$window', function($window) {
      spyOn($window, 'confirm').and.callFake(function(){
        return true;
      });
      
      var okSpy = jasmine.createSpy('ok');
      Alert.confirm('message', okSpy);
      expect(okSpy).toHaveBeenCalled();
    }]));
    
    it('should call onCancel callback', inject(['$window', function($window) {
      spyOn($window, 'confirm').and.callFake(function(){
        return false;
      });
      
      var cancelSpy = jasmine.createSpy('cancel');
      Alert.confirm('message', angular.noop, cancelSpy);
      expect(cancelSpy).toHaveBeenCalled();
    }]));
  });
});

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

/*global spyOn : false */

describe('cacheRemoveInterceptor service', function(){
  var interceptor,
    $rootScope;
  
  beforeEach(module('liveopsConfigPanel.shared.services'));
  
  beforeEach(inject(['cacheRemoveInterceptor', '$rootScope', function(cacheRemoveInterceptor, _$rootScope) {
    interceptor = cacheRemoveInterceptor;
    $rootScope = _$rootScope;
  }]));
  
  describe('response function', function(){
    it('should remove the resource from the stored array in the cache', inject(['queryCache', function(queryCache) {
      var MyResource = function(id){
        this.id = id;
      };
      MyResource.prototype.resourceName = 'myResource';
      var myResource = new MyResource('myid');
      
      var cachedArr = [{id: '1'}, {id: 2}, myResource];
      spyOn(queryCache, 'get').and.returnValue(cachedArr);
      
      interceptor.response({
          resource: myResource
      });
      expect(cachedArr.length).toBe(2);
    }]));
    
    it('should do nothing if there is no cached array', inject(['queryCache', function(queryCache) {
      var MyResource = function(id){
        this.id = id;
      };
      MyResource.prototype.resourceName = 'myResource';
      var myResource = new MyResource('myid');

      spyOn(queryCache, 'get');
      
      var response = {
          resource: myResource
      };
      
      var result = interceptor.response(response);
      expect(result).toBe(myResource);
    }]));
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('emitInterceptor', ['$rootScope', '$q', '$location', 'Session', 'apiHostname',
    function ($rootScope, $q, $location, Session, apiHostname) {
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

/*global spyOn : false */

describe('emitInterceptor service', function(){
  var emitInterceptor,
    $rootScope;
  
  beforeEach(module('liveopsConfigPanel.shared.services'));
  
  beforeEach(inject(['emitInterceptor', '$rootScope', function(_emitSaveInterceptor, _$rootScope) {
    emitInterceptor = _emitSaveInterceptor;
    $rootScope = _$rootScope;
  }]));
  
  describe('response function', function(){
    it('should broadcast created resource on 201 status', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      emitInterceptor.response({
        config : {
          url: '/test'
        },
        status: 201,
        resource: {}
      });
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('created:resource:test', {});
    }));
    
    it('should broadcast updated resource on 200 status', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      emitInterceptor.response({
        config : {
          url: '/test/123'
        },
        status: 200,
        resource: {}
      });
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('updated:resource:test', {});
    }));
    
    it('should do nothing on a status other than 200 and 201', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      emitInterceptor.response({
        config : {
          url: '/test'
        },
        status: 205,
        resource: {}
      });
      
      expect($rootScope.$broadcast).not.toHaveBeenCalled();
    }));
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'queryCache', 'lodash',
    function($http, $resource, $q, apiHostname, Session, queryCache, _) {
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
          
          var Resource = $resource(apiHostname + params.endpoint, params.requestUrlFields, {
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

/*global jasmine : false */

describe('LiveopsResourceFactory', function () {
  describe('ON reset', function() {
    var Resource;
    
    beforeEach(module('liveopsConfigPanel.shared.services'));
    
    beforeEach(inject(['LiveopsResourceFactory',
      function (LiveopsResourceFactory) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });
      }]));
    
    it('should reset object back to $original', function () {
      var resource = new Resource();
      resource.$original = {
        id: 'abc'
      };
      
      resource.id = '123';

      resource.reset();
      
      expect(resource.id).toEqual('abc');
      
    });
    
    it('should ignore $ members', function () {
      var resource = new Resource();
      resource.$original = {
        $id: 'abc'
      };
      
      resource.$id = '123';
      
      resource.reset();
      
      expect(resource.$id).toEqual('123');
    });
  });
  
  describe('queryCache function', function () {
    var apiHostname,
      Resource,
      $httpBackend;

    beforeEach(module('gulpAngular'));
    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.services.mock.content.management.skills'));

    beforeEach(inject(['LiveopsResourceFactory', '$httpBackend', 'apiHostname',
      function (LiveopsResourceFactory, _$httpBackend_, _apiHostname_) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });
        $httpBackend = _$httpBackend_;
        apiHostname = _apiHostname_;
      }]));

    describe('$original copy', function () {
      it('should store a pristine copy of all objects returned on query', function () {

        $httpBackend.whenGET(apiHostname + '/endpoint').respond(200, [
          {id: '1'}, {id: '2'}
        ]);

        var resources = Resource.query();

        $httpBackend.flush();

        expect(resources[0].$original.id).toEqual('1');
        expect(resources[1].$original.id).toEqual('2');
      });

      it('should store a pristine copy of the object returned on get', function () {

          $httpBackend.expectGET(apiHostname + '/endpoint').respond(200, {id: '1'});

          var resource = Resource.get();

          $httpBackend.flush();

          expect(resource.$original.id).toEqual('1');
      });

      it('should have a function to reset an object back to its original state', function () {

          $httpBackend.expectGET(apiHostname + '/endpoint').respond(200, {id: '1'});

          var resource = Resource.get();

          $httpBackend.flush();

          resource.id = 'abc';

          resource.reset();

          expect(resource.id).toEqual('1');
      });
    });
    
    describe('ON cachedQuery', function () {
      beforeEach(inject([
        function () {
          spyOn(Resource, 'query').and.returnValue([]);
        }
      ]));

      it('should return api data on first call', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);
          expect(queryCache.get('key')).toBe(result);
        }
      ]));

      it('should return cached data on second call', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);

          Resource.query = jasmine.createSpy().and.returnValue([{
            id: 'id1'
          }]);

          result = Resource.cachedQuery({}, 'key');

          expect(result.length).not.toEqual(1);
          expect(queryCache.get('key')).toBe(result);
        }
      ]));

      it('should return api data when invalidate is true', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);
          expect(queryCache.get('key')).toBe(result);

          Resource.query = jasmine.createSpy().and.returnValue([{
            id: 'id1'
          }]);

          result = Resource.cachedQuery({}, 'key', true);

          expect(result.length).toEqual(1);
          expect(result[0].id).toEqual('id1');
          expect(queryCache.get('key')).toBe(result);
        }
      ]));
    });
  });

  describe('USING mock $resource', function () {
    var Resource,
      resourceSpy,
      apiHostname,
      LiveopsResourceFactory,
      protoUpdateSpy,
      protoSaveSpy,
      givenConfig;

    beforeEach(module('liveopsConfigPanel.shared.services', function ($provide) {
      resourceSpy = jasmine.createSpy('ResourceMock').and.callFake(function (endpoint, fields, config) {
        givenConfig = config;

        protoSaveSpy = jasmine.createSpy('$save');
        protoUpdateSpy = jasmine.createSpy('$update');

        function resource() {
          this.$save = protoSaveSpy;
          this.$update = protoUpdateSpy;
        }

        return resource;
      });

      $provide.value('$resource', resourceSpy);
    }));

    beforeEach(inject(['apiHostname', 'LiveopsResourceFactory',
      function (_apiHostname_, _LiveopsResourceFactory_) {
        apiHostname = _apiHostname_;
        LiveopsResourceFactory = _LiveopsResourceFactory_;
      }
    ]));

    it('should call the $resource constructor', inject(function () {
      Resource = LiveopsResourceFactory.create({
        endpoint: '/endpoint'
      });

      expect(resourceSpy).toHaveBeenCalledWith(apiHostname + '/endpoint', jasmine.any(Object), {
        query: jasmine.any(Object),
        get: jasmine.any(Object),
        update: jasmine.any(Object),
        save: jasmine.any(Object),
        delete: jasmine.any(Object)
      });
    }));

    it('should use given requestUrlFields if defined', inject(function () {
      Resource = LiveopsResourceFactory.create({
        endpoint: '/endpoint', 
        requestUrlFields: {
          title: '@title'
        }
      });

      expect(resourceSpy).toHaveBeenCalledWith(apiHostname + '/endpoint', {
        title: '@title'
      }, {
        query: jasmine.any(Object),
        get: jasmine.any(Object),
        update: jasmine.any(Object),
        save: jasmine.any(Object),
        delete: jasmine.any(Object)
      });
    }));

    describe('update config', function () {
      describe('transformRequest function', function () {
        it('should return empty object when not given any updatefields', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint'
          });
          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            someProp: 'someValue',
            anotherProp: 'anotherValue'
          });
          expect(result).toEqual('{}');
        }]));

        it('should only return fields given by updatefields', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint', 
            updateFields: [
              {name: 'myfield'}, 
              {name: 'coolfield'}
            ]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: 'someValue',
            coolfield: 'thats cool',
            uncool: 'not cool at all'
          });
          expect(result).toEqual('{"myfield":"someValue","coolfield":"thats cool"}');
        }]));

        it('should not include null data if its optional', inject([function () {
          LiveopsResourceFactory.create({
              endpoint: '/endpoint', 
              updateFields: [{
                name: 'myfield',
                optional: true
              }]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: null
          });
          expect(result).toEqual('{}');
        }]));

        it('should include null data if its not optional', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint', 
            updateFields: [{
              name: 'myfield',
              optional: false
            }]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: null
          });
          expect(result).toEqual('{"myfield":null}');
        }]));
      });

      describe('transformResponse', function () {
        it('should append a function to the transformResponse array to return data from the result object', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint'
          });
          var transformResponse = givenConfig.update.transformResponse[givenConfig.update.transformResponse.length - 1];
          var result = transformResponse({
            result: {
              someProp: 'somevalue'
            }
          });
          expect(result).toEqual({
            someProp: 'somevalue'
          });

          result = transformResponse({
            someProp: 'somevalue'
          });
          expect(result).toEqual({
            someProp: 'somevalue'
          });

          result = transformResponse([]);
          expect(result).toEqual([]);
        }]));
      });
    });

    describe('query config', function () {
      it('should set isArray to true', inject([function () {
        LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        expect(givenConfig.query.isArray).toBeTruthy();
      }]));
    });

    describe('prototype save function', function () {
      it('should call $update if the object exists', inject(['$q', function ($q) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        var resource = new Resource();
        resource.id = 'id1';

        resource.$update = protoUpdateSpy.and.returnValue($q.when({}));
        resource.save();
        expect(protoUpdateSpy).toHaveBeenCalled();
      }]));

      it('should call $save if the object if new', inject(['$q', function ($q) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        var resource = new Resource();

        resource.$save = protoSaveSpy.and.returnValue($q.when({}));
        resource.save();
        expect(protoSaveSpy).toHaveBeenCalled();
      }]));
    });
  });
});

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

/*global spyOn : false */

describe('Modal service', function(){
  var Modal;
  
  beforeEach(module('liveopsConfigPanel.shared.services'));
  
  beforeEach(inject(['Modal', function(_Modal_) {
    Modal = _Modal_;
  }]));
  
  describe('close function', function(){
    it('should remove all modal elements from the document', inject(['$document', function($document) {
      var removeSpy = jasmine.createSpy('remove');
      var findSpy = spyOn($document, 'find').and.returnValue({remove: removeSpy});
      Modal.close();
      expect(findSpy).toHaveBeenCalledWith('modal');
      expect(removeSpy).toHaveBeenCalled();
    }]));
  });
  
  describe('showConfirm function', function(){
    it('should add a modal element with defaults', inject(['$document', function($document) {
      var appendSpy = jasmine.createSpy('append');
      var findSpy = spyOn($document, 'find').and.returnValue({append: appendSpy});
      
      Modal.showConfirm();
      
      expect(findSpy).toHaveBeenCalledWith('body');
      var scopeObj = appendSpy.calls.mostRecent().args[0].scope();

      expect(scopeObj.title).toEqual('');
      expect(scopeObj.message).toEqual('');
      
      spyOn(Modal, 'close');
      scopeObj.okCallback();
      expect(Modal.close).toHaveBeenCalled();
      
      Modal.close.calls.reset();
      scopeObj.cancelCallback();
      expect(Modal.close).toHaveBeenCalled();
    }]));
    
    it('should allow setting of custom properties', inject(['$document', function($document) {
      var appendSpy = jasmine.createSpy('append');
      var findSpy = spyOn($document, 'find').and.returnValue({append: appendSpy});
      
      var cancelSpy = jasmine.createSpy('cancel');
      var okSpy = jasmine.createSpy('ok');
      
      Modal.showConfirm({
        title: 'my title',
        message: 'my message',
        okCallback: okSpy,
        cancelCallback: cancelSpy
      });
      
      expect(findSpy).toHaveBeenCalledWith('body');
      var scopeObj = appendSpy.calls.mostRecent().args[0].scope();

      expect(scopeObj.title).toEqual('my title');
      expect(scopeObj.message).toEqual('my message');
      
      spyOn(Modal, 'close');
      scopeObj.okCallback();
      expect(Modal.close).toHaveBeenCalled();
      expect(okSpy).toHaveBeenCalled();
      
      Modal.close.calls.reset();
      scopeObj.cancelCallback();
      expect(Modal.close).toHaveBeenCalled();
      expect(cancelSpy).toHaveBeenCalled();
    }]));
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('Chain', ['$cacheFactory', function ($cacheFactory) {
    $cacheFactory('chains');

    var Chain = function(name) {
      this.name = name;
    };
    
    Chain.create = function(name, callback) {
      var chain = Chain.get(name);
      chain.hook('init', callback, 0);
      return chain;
    };
    
    Chain.get = function(name) {
      var chains = $cacheFactory.get('chains');

      if(!chains.get(name)) {
        chains.put(name, {});
      }

      return new Chain(name);
    };

    Chain.prototype.hook = function(id, callback, priority) {
      var chains = $cacheFactory.get('chains');
      var links = chains.get(this.name);
      
      links[id] = {
        id: id,
        callback: callback,
        priority: priority
      };
    };

    Chain.prototype.execute = function(param) {
      var chains = $cacheFactory.get('chains');
      var chain = chains.get(this.name);

      var promise;
      angular.forEach(chain, function (link) {
        if (promise) {
          if (angular.isFunction(link.callback)) {
            promise.then(link.callback);
          } else if (angular.isObject(link.callback)) {
            promise.then(
              link.callback.success,
              link.callback.failure);
          } else {
            throw new Error('Invalid callback type "' + typeof link.callback + '"');
          }
        } else if(angular.isFunction(link.callback)) {
          promise = link.callback(param);
        } else {
          throw new Error('Invalid callback type "' + typeof link.callback + '"');
        }
      });
    };

    return Chain;
  }]);

'use strict';

describe('Chain service', function () {
  var Chain,
    $cacheFactory;

  beforeEach(module('liveopsConfigPanel.shared.services'));
  beforeEach(module('liveopsConfigPanel.shared.services.mock.content'));

  beforeEach(inject(['Chain', '$cacheFactory',
    function (_Chain, _$cacheFactory) {
      Chain = _Chain;
      $cacheFactory = _$cacheFactory;
    }
  ]));

  describe('ON Chain.get', function () {
    it('should return an empty object on first get', function () {
      Chain.get('user:save');
      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain).toEqual(jasmine.any(Object));
    });

    it('should cache the items I push to it', function () {
      Chain.get('user:save').hook('link1', function(){});

      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain.hasOwnProperty('link1')).toBeTruthy();
    });

    it('should not create a new chain once already got', function () {
      Chain.get('user:save').hook('link1', function(){});
      Chain.get('user:save');

      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain.hasOwnProperty('link1')).toBeTruthy();
    });
  });

  describe('ON Chain.prototype.hook', function () {
    it('should push callback onto the chain', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);

      var chainCache = $cacheFactory.get('chains').get('chain1');

      expect(chainCache.hasOwnProperty('link1')).toBeTruthy();
      expect(chainCache.link1.id).toEqual('link1');
      expect(chainCache.link1.priority).toEqual(100);
    });

    it('should push multiple callback onto the chain', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);
      chain.hook('link2', null, 50);

      var chainCache = $cacheFactory.get('chains').get('chain1');

      expect(chainCache.hasOwnProperty('link1')).toBeTruthy();
      expect(chainCache.link1.id).toEqual('link1');
      expect(chainCache.link1.priority).toEqual(100);

      expect(chainCache.hasOwnProperty('link2')).toBeTruthy();
      expect(chainCache.link2.id).toEqual('link2');
      expect(chainCache.link2.priority).toEqual(50);
    });
  });

  describe('ON Chain.prototype.execute', function () {
    var $q,
      $timeout;

    beforeEach(inject(['$q', '$timeout', function(_$q, _$timeout) {
      $q = _$q;
      $timeout = _$timeout;
    }]));

    it('should execute single callback', function() {
      var spy = jasmine.createSpy('first callback');

      var chain = Chain.get('chain1');
      chain.hook('link1', spy, 100);

      chain.execute();

      expect(spy).toHaveBeenCalled();
    });

    it('should throw error if first callback is not a function', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);

      var error;
      try {
        chain.execute();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should throw error if any callback is not a function or object', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', function() {
        return $q.when();
      }, 1);

      chain.hook('link2', null, 2);

      var error;
      try {
        chain.execute();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    describe('WHEN first link is resolved', function() {
      var promiseCallback;
      beforeEach(function() {
        promiseCallback = function() {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.resolve();
          });

          return deferred.promise;
        };
      });

      it('should execute second link callback', function() {
        var spy = jasmine.createSpy('second callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);
        chain.hook('link2', spy, 2);

        chain.execute();

        $timeout.flush();

        expect(spy).toHaveBeenCalled();
      });

      it('should execute second links success', function() {
        var spySuccess = jasmine.createSpy('success callback');
        var spyFail = jasmine.createSpy('fail callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);

        chain.hook('link2', {
          success: spySuccess,
          fail: spyFail
        }, 2);

        chain.execute();

        $timeout.flush();

        expect(spySuccess).toHaveBeenCalled();
        expect(spyFail).not.toHaveBeenCalled();
      });
    });

    describe('WHEN first link is rejected', function() {
      var promiseCallback;
      beforeEach(function() {
        promiseCallback = function() {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.reject();
          });

          return deferred.promise;
        };
      });

      it('should not execute second callback if first callback is rejected', function() {
        var spy = jasmine.createSpy('second callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);
        chain.hook('link2', spy, 2);

        chain.execute();

        $timeout.flush();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should execute second links fail', function() {
        var spySuccess = jasmine.createSpy('success callback');
        var spyFail = jasmine.createSpy('fail callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);

        chain.hook('link2', {
          success: spySuccess,
          failure: spyFail
        }, 2);

        chain.execute();

        $timeout.flush();

        expect(spySuccess).not.toHaveBeenCalled();
        expect(spyFail).toHaveBeenCalled();
      });
    });
  });
});

'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editFieldDropDown', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/directives/editField/dropDown/editField_DropDown.html',
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

/* global spyOn: false  */

describe('editField dropDownDirective', function(){
  var $scope,
    $compile;
    
  var objectId = '1c838030-f772-11e4-ac37-45b2e1245d4b';
  var ngModel = 'Ron';
  
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));
  
  it('should emit event on saveHandler', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field-drop-down ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field-drop-down>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    spyOn(childScope, '$emit');
    
    expect(childScope.saveHandler).toBeDefined();
    childScope.saveHandler();
    
    expect(childScope.$emit).toHaveBeenCalledWith('editField:save', {
      objectId: objectId,
      fieldName: 'name',
      fieldValue: ngModel
    });
  }));
  
  it('should set edit to true on successful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field-drop-down ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field-drop-down>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 200
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save', e, response);
    
    expect(childScope.edit).toEqual(false);
  }));
  
  it('should not set edit to true on unsuccessful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field-drop-down ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field-drop-down>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 404
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save:error', e, response);
    
    expect(childScope.edit).toEqual(true);
  }));
});
'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('editField', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/editField/input/editField_input.html',
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

'use strict';

/* global spyOn: false  */

describe('editField', function(){
  var $scope,
    $compile;
    
  var objectId = '1c838030-f772-11e4-ac37-45b2e1245d4b';
  var ngModel = 'Ron';
  
  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));
  
  it('should emit event on saveHandler', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    spyOn(childScope, '$emit');
    
    expect(childScope.saveHandler).toBeDefined();
    childScope.saveHandler();
    
    expect(childScope.$emit).toHaveBeenCalledWith('editField:save', {
      objectId: objectId,
      fieldName: 'name',
      fieldValue: ngModel
    });
  }));
  
  it('should set edit to true on successful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 200
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save', e, response);
    
    expect(childScope.edit).toEqual(false);
  }));
  
  it('should not set edit to true on unsuccessful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 404
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save:error', e, response);
    
    expect(childScope.edit).toEqual(true);
  }));
});