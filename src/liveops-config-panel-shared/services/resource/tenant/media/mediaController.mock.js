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