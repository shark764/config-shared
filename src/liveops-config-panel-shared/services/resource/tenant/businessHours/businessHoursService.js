'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('BusinessHours', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:id',
        resourceName: 'BusinessHours',
        //TODO: Field names are currently unknown, will update when API component is finished
        updateFields: [],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      BusinessHours.prototype.getDisplay = function () {
        return this.name;
      };

      return BusinessHours;
    }
  ]);