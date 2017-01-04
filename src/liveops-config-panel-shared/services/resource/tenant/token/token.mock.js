'use strict';

angular.module('liveopsConfigPanel.tenant.token.mock', ['liveopsConfigPanel.mock'])
  .service('mockToken', function (Token) {
    return new Token({
      'name': 'user@serenova.com',
      'password': 'passwordTime'
    });
  })
  .run(['$httpBackend', 'apiHostname', 'mockToken',
    function ($httpBackend, apiHostname) {
      $httpBackend.when('POST', apiHostname + '/v1/tokens').respond({
        'result': {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLWlkIjoiYzA5NTFkNTAtNjU2Yy0xMWU2LWIxYjktY2E4MTQ4NDQ4OGRmIiwidHlwZSI6InRva2VuIiwiZXhwIjoxNDc4NzEwMzk0LCJpYXQiOjE0Nzg2MjM5OTR9.JhUVmcBiJ3GvroQ3HfX8hZYAiEjfXHO2EI1J-XhJt88',
          ttl: 86400
        }
      });
    }
  ]);
