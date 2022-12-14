'use strict';

angular.module('liveopsConfigPanel.tenant.user.mock',
  ['liveopsConfigPanel.mock', 'liveopsConfigPanel.tenant.role.mock'])
  .service('mockTenantUsers', function (TenantUser) {
    return [new TenantUser({
      'id': 'userId1',
      'status': 'accepted',
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': [],
    }), new TenantUser({
      'id': 'userId2',
      'status': 'disabled',
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': [],
    }), new TenantUser({
      'email': 'test1@bluespurs.com',
      'createdBy': 'userId1',
      'personalTelephone': null,
      'platformStatus': 'accepted',
      'firstName': 'test',
      'created': '2015-08-19T13:25:13Z',
      'state': 'offline',
      'extension': 'ca027450_4673_11e5_bded_621c6d9e2761',
      '$skills': [],
      'status': 'accepted',
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
        'description': 'everyone group',
      }],
      'invitationStatus': 'pending',
      'roleId': 'roleId1',
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
      'status': 'accepted',
      'userId': 'userId100',
      'sessionStarted': '2015-08-19T13:36:11Z',
      'roleId': 'roleId1',
    }), new TenantUser({
      'email': 'test2@bluespurs.com',
      'createdBy': 'userId3',
      'personalTelephone': null,
      'firstName': 'test',
      'created': '2015-08-19T13:25:13Z',
      'state': 'offline',
      'extension': 'ca027450_4673_11e5_bded_621c6d9e2761',
      '$skills': [],
      'status': 'accepted',
      'id': 'userId300',
      'lastName': '1',
      'groups': [{
        'tenantId': 'tenant-id',
        'memberId': 'userId3',
        'groupId': 'groupId1',
        'added': '2015-08-19T13:25:13Z',
        'memberType': 'user',
        'name': 'everyone',
        'ower': 'userId3',
        'description': 'everyone group'
      }],
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
