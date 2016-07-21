'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Contacts', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor) {

      var Contacts = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/campaigns/:campaignId/call-list',
        resourceName: 'Contacts',
        updateFields: [{
          name: 'name'
        }, {
          name: 'phoneNumber'
        }, {
          name: 'state'
        }, {
          name: 'country',
        }, {
          name:'defaultTimezone'
        },{
          name: 'defaultLeadExpiration',
          optional:true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      Contacts.prototype.getDisplay = function () {
        return this.name;
      };

      return Contacts;
    }
  ]);
