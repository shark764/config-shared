'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Timezone', ['$resource', '$http', 'apiHostname', 'resultTransformer',
    function ($resource, $http, apiHostname, resultTransformer) {
      var Timezone = $resource(apiHostname + '/v1/timezones', {}, {
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

      Timezone.prototype.getDisplay = function () {
        return '(' + this.offset + ') ' + this.timezone;
      };

      return Timezone;
    }
  ]);