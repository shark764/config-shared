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