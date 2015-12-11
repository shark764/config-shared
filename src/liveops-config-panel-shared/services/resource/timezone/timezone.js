'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Timezone', ['$resource', '$http', 'apiHostname', 'resultTransformer',
    function($resource, $http, apiHostname, resultTransformer) {
      return $resource(apiHostname + '/v1/timezones', {}, {
        query: {
          method: 'GET',
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          },
          transformResponse: Array.prototype.concat($http.defaults.transformResponse, resultTransformer),
          cache: true
        },
      });
    }
  ]);
