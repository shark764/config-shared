'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Token', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var Token =  LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tokens',
        resourceName: 'Token',
        updateFields: [{
          name: 'username'
        }, {
          password: 'password'
        }]
      });

      return Token;
    }
  ]);
