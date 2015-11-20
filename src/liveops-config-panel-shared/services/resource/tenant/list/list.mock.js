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