'use strict';

angular.module('liveopsConfigPanel.tenant.businessHour.mock', ['liveopsConfigPanel.mock'])
  .service('mockBusinessHours', function (BusinessHour) {
    return [new BusinessHour({
      'id': 'businessHourId1',
      'name': 'bh1',
      'tenantId': 'tenant-id',
      'description': null,
      'active': true,
      'timezone': 'America/Argentina/Buenos_Aires',
      
      'sunStartTimeMinutes': null,
      'sunEndTimeMinutes': null,
      'monStartTimeMinutes': null,
      'monEndTimeMinutes': null,
      'tueStartTimeMinutes': null,
      'tueEndTimeMinutes': null,
      'wedStartTimeMinutes': null,
      'wedEndTimeMinutes': null,
      'thuStartTimeMinutes': null,
      'thuEndTimeMinutes': null,
      'friStartTimeMinutes': null,
      'friEndTimeMinutes': null,
      'satEndTimeMinutes': null,
      'satStartTimeMinutes': null,
      
      'exceptions': [{
        'id': 'businessHourException1',
        'businessHoursId': 'businessHour1',
        'date': '2016-12-10T00:00:00Z',
        'tenantId': 'tenant-id',
        'description': null,
        'isAllDay': false,
        'startTimeMinutes': 0,
        'endTimeMinutes': 480
      }, {
        'id': 'businessHourException2',
        'businessHoursId': 'businessHour1',
        'date': '2016-12-10T00:00:00Z',
        'tenantId': 'tenant-id',
        'description': null,
        'isAllDay': false,
        'startTimeMinutes': 60,
        'endTimeMinutes': 780
      }]
    }), new BusinessHour({
      'id': 'businessHourId2',
      'name': 'bh1',
      'tenantId': 'tenant-id',
      'description': null,
      'active': true,
      'timezone': 'America/Halifax',
      
      'sunStartTimeMinutes': 60,
      'sunEndTimeMinutes': 780,
      'monStartTimeMinutes': null,
      'monEndTimeMinutes': null,
      'tueStartTimeMinutes': null,
      'tueEndTimeMinutes': null,
      'wedStartTimeMinutes': null,
      'wedEndTimeMinutes': null,
      'thuStartTimeMinutes': null,
      'thuEndTimeMinutes': null,
      'friStartTimeMinutes': null,
      'friEndTimeMinutes': null,
      'satEndTimeMinutes': null,
      'satStartTimeMinutes': null,
      'exceptions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockBusinessHours',
    function ($httpBackend, apiHostname, mockBusinessHours) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1').respond({
        'result': mockBusinessHours[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId2').respond({
        'result': mockBusinessHours[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours').respond({
        'result': [mockBusinessHours[0], mockBusinessHours[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId0').respond(404);
    }
  ]);