'use strict';

angular.module('liveopsConfigPanel.shared.services')
.factory('DncListEdit', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'emitErrorInterceptor',
  function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, emitErrorInterceptor) {

      var DncListEdit = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/dnclists/:dnclistId',
        resourceName: 'DncListEdit',
        updateFields: [{
          name: 'contact'
        }, {
          name: 'expiration'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      DncListEdit.prototype.getDisplay = function () {
        return this.contact;
      };

      DncListEdit.prototype.getContact = function () {
        return this.contact;
      };

      return DncListEdit;
    }
  ]);
