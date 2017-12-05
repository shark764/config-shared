'use strict';

angular.module('liveopsConfigPanel.tenant.me.mock', ['liveopsConfigPanel.mock'])
  .service('mockMeTenants', ['Me', function (Me) {
    return [new Me({
      'active': true,
      'tenantId': 'tenantId-1',
  		'name': 'Tenant Name',
  		'description': 'Mock description for Tenant Name',
  		'password': true,
  		'identityProviders': []
    }), new Me({
      'active': true,
  		'tenantId': 'tenantId-2',
  		'name': 'Doron\'s Terrific Tenant',
  		'description': 'Doron\'s Terrific Tenant here',
  		'password': true,
  		'identityProviders': [{
  			'id': 'idp-1',
  			'name': 'Idp 1',
  			'client': 'clientId-1',
  			'domain': 'idp-domain'
  		}]
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockMeTenants',
    function ($httpBackend, apiHostname, mockMeTenants) {
      $httpBackend.when('GET', apiHostname + '/v1/me').respond({
        'result': [mockMeTenants[0], mockMeTenants[1]]
      });
    }
  ]);
