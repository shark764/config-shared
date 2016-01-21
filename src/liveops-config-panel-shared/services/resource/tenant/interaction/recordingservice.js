'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Recording', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var Recording = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/interactions/:interactionId/recordings/:id',
        resourceName: 'Recording'
      });

      Recording.prototype.getDisplay = function () {
        return this.name;
      };

      return Recording;
    }
  ]);