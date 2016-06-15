'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('CustomStatDraft', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', '$http',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, $http) {

      var endpoint = apiHostname + '/v1/tenants/:tenantId/custom-stats/:customStatId/drafts/:id';

      var CustomStatDraft = LiveopsResourceFactory.create({
        endpoint: endpoint,
        resourceName: 'CustomStatDraft',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'customStatId'
        }, {
          name: 'customStat'
        }, {
          name: 'history'
        }, {
          name: 'metadata'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      CustomStatDraft.prototype.getDisplay = function () {
        return this.name;
      };

      CustomStatDraft.prototype.validate = function () {
        var url = apiHostname + '/v1/tenants/' + this.tenantId + '/custom-stats/' + this.customStatId + '/drafts/' + this.id + '/validate';

        return $http({
          method: 'POST',
          url: url
        }).then(function successCallback() {
          return true;
        }, function errorCallback(response) {
          return response;
        });
      };

      return CustomStatDraft;
    }
  ]);
