'use strict';

angular.module('liveopsConfigPanel.timezone.mock', ['liveopsConfigPanel.mock'])
  .service('mockTimezones', function () {
    return [
      'America/Edmonton',
      'America/Eirunepe',
      'America/El_Salvador',
      'America/Ensenada',
      'America/Fort_Wayne',
      'America/Fortaleza',
      'America/Glace_Bay',
      'America/Godthab',
      'America/Goose_Bay',
      'America/Grand_Turk',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Guatemala',
      'America/Guayaquil',
      'America/Guyana',
      'America/Halifax'
    ];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTimezones',
    function ($httpBackend, apiHostname, mockTimezones) {
      $httpBackend.when('GET', apiHostname + '/v1/timezones').respond({
        'result': mockTimezones
      });
    }
  ]);