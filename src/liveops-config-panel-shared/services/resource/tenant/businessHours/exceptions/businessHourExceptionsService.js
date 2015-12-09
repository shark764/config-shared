'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('BusinessHourException', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:businessHourId/exceptions/:id',
        resourceName: 'BusinessHourException',
        updateFields: [{
          name: 'date'
        }, {
          name: 'isAllDay'
        }],

        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      BusinessHours.prototype.getDisplay = function () {
        return this.name;
      };

      return BusinessHours;
    }
  ]);
