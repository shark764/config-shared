'use strict';

angular.module('liveopsConfigPanel.shared.config')

.constant('loSharedEvents', {
  api: {
    response: {
      '4xx': 'api:response:4xx',
      '400': 'api:response:400',
      '401': 'api:response:401',
      '403': 'api:response:403',
      '404': 'api:response:404',
      '5xx': 'api:response:5xx',
      '500': 'api:response:500',
      '503': 'api:response:503'
    }
  }
})

;
