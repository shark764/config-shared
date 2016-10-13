'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Messaging', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var Messaging = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/messaging/tenants/:tenantId/channels/:interactionId/history',
        resourceName: 'Messaging'
      });

      Messaging.prototype.getDisplay = function () {
        return this.name;
      };

      return Messaging;
    }
  ])
  .factory('MessagingFrom', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      var MessagingFrom = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/messaging/tenants/:tenantId/users/:from',
        resourceName: 'MessagingFrom'
      });

      MessagingFrom.prototype.getDisplay = function () {
        return this.name;
      };

      return MessagingFrom;
    }
  ]);
