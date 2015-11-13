'use strict';

angular.module('liveopsConfigPanel.tenant.listType.mock', ['liveopsConfigPanel.mock'])
  .service('mockListTypes', ['ListType', function (ListType) {
    return [new ListType({
      'id': 'listTypeId1',
      'fields': [{
        "type": "string",
        "name": "field1",
        "label": "String field",
        "required": true
      }, {
        "type": "number",
        "name": "field2",
        "label": "Number field",
        "required": false
      }, {
        "type": "boolean",
        "name": "field3",
        "label": "Bool field",
        "required": false
      }]
    }), new ListType({
      'id': 'listTypeId2',
      'fields': [{
        "type": "boolean",
        "name": "field1",
        "label": "Bool field",
        "required": true
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