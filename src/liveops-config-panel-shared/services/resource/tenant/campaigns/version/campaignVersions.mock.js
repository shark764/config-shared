'use strict';

angular.module('liveopsConfigPanel.tenant.campaign.version.mock', [
    'liveopsConfigPanel.mock',
    'liveopsConfigPanel.tenant.campaign.mock'
  ])
  .value('mockCampaignVersions', [{
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
  .run(['$httpBackend', 'apiHostname', 'mockCamapigns', 'mockCampaignVersions', 'Session',
    function ($httpBackend, apiHostname, mockCampaigns, mockCampaignVersions, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[0].id + '/versions/' + mockCampaignVersions[0].id).respond({
        'result': mockCampaignVersions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[0].id + '/versions/' + mockCampaignVersions[1].id).respond({
        'result': mockCampaignVersions[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[1].id + '/versions/' + mockCampaignVersions[2].id).respond({
        'result': mockCampaignVersions[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[0].id + '/versions').respond({
        'result': [mockCampaignVersions[0], mockCampaignVersions[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + mockCampaigns[2].id + '/versions').respond({
        'result': mockCampaignVersions[3]
      });
    }
  ]);
