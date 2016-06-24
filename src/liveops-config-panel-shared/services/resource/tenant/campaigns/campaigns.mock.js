'use strict';

angular.module('liveopsConfigPanel.tenant.campaign.mock', ['liveopsConfigPanel.mock'])
  .service('mockCampaigns', function(Campaign){
    return [new Campaign({
      name: 'Coffee is for closers',
      description: 'First prize is a Cadillac El Dorado',
      id: 'cc5ee630-526b-4a1c-b148-75d476d507ec'
    }), new Campaign({
      name: 'Clint "Broke Hand" Cameron',
      description: 'Second prize is a set of steak knives',
      id: '0d0ff512-9080-4be1-8bf9-0a978cdc3431'
    }), new Campaign({
      name: 'Clint "Broke Hand" Cameron',
      description: 'Second prize is a set of steak knives',
      id: '0d0ff512-9080-4be1-8bf9-0a978cdc3431'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockCampaigns', 'Session',
    function ($httpBackend, apiHostname, mockCampaigns, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[0].id).respond({
        'result': mockCampaigns[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[1].id).respond({
        'result': mockCampaigns[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns').respond({
        'result': mockCampaigns
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns').respond({
        'result': mockCampaigns[2]
      });
    }
  ]);
