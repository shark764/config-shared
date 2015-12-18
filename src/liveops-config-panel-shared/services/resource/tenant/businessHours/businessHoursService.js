'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('BusinessHour', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor', 'businessHourInterceptor', 'businessHourQueryInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor, businessHourInterceptor, businessHourQueryInterceptor) {

      var BusinessHours = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/business-hours/:id',
        resourceName: 'BusinessHour',
        updateFields: [{
          name: 'name'
        }, {
          name: 'active'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'timezone'
        }, {
          name: 'sunStartTimeMinutes',
          optional: true
        }, {
          name: 'sunEndTimeMinutes',
          optional: true
        }, {
          name: 'monStartTimeMinutes',
          optional: true
        }, {
          name: 'monEndTimeMinutes',
          optional: true
        }, {
          name: 'tueStartTimeMinutes',
          optional: true
        }, {
          name: 'tueEndTimeMinutes',
          optional: true
        }, {
          name: 'wedStartTimeMinutes',
          optional: true
        }, {
          name: 'wedEndTimeMinutes',
          optional: true
        }, {
          name: 'thuStartTimeMinutes',
          optional: true
        }, {
          name: 'thuEndTimeMinutes',
          optional: true
        }, {
          name: 'friStartTimeMinutes',
          optional: true
        }, {
          name: 'friEndTimeMinutes',
          optional: true
        }, {
          name: 'satStartTimeMinutes',
          optional: true
        }, {
          name: 'satEndTimeMinutes',
          optional: true
        }],
        getInterceptor: businessHourInterceptor,
        queryInterceptor: businessHourQueryInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      BusinessHours.prototype.getDisplay = function () {
        return this.name;
      };

      return BusinessHours;
    }
  ]);
