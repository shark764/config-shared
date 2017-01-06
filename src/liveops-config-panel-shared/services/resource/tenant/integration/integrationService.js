'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor) {

      var Integration = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/integrations/:id',
        resourceName: 'Integration',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description'
        }, {
          name: 'properties'
        }, {
          name: 'accountSid'
        }, {
          name: 'authToken'
        }, {
          name: 'webRtc'
        }, {
          name: 'active'
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Integration.prototype.getDisplay = function () {
        return this.type;
      };

      Integration.prototype.handleAuthMethodSelect = function (scope, authMethod, initialLoad) {
        // the conditional statement below allows  for situations where
        // we have to pass the integration data as opposed to the scope of the controller
        if (scope.hasOwnProperty('id')) {
          scope.selectedIntegration = scope;
        }

        if (initialLoad === 'true') {
          scope.selectedIntegration.authType = authMethod;
          return;
        }

        if (authMethod === 'basic') {
          scope.selectedIntegration.authType = 'token';
        } else {
          scope.selectedIntegration.authType = 'basic';
        }
      };

      Integration.prototype.deleteExtraneousData = function (scope) {
        // the conditional statement below allows for situations where
        // we have to pass the integration data as opposed to the scope of the controller
        var dataWithoutScope = false;
        if (scope.hasOwnProperty('id')) {
          scope.selectedIntegration = scope;
          dataWithoutScope = true;
        }

        if (scope.selectedIntegration.description === null) {
          delete scope.selectedIntegration.description;
        }

        if (scope.selectedIntegration.authType) {
          if (scope.selectedIntegration.authType === 'token') {
            scope.selectedIntegration.properties.username =
            scope.selectedIntegration.properties.password = '';
          } else {
            scope.selectedIntegration.properties.token = '';
          }

          delete scope.selectedIntegration.authType;
        }

        if (dataWithoutScope === false && scope.selectedIntegration.type && scope.selectedIntegration.type.hasOwnProperty('value')) {
          scope.selectedIntegration.type = scope.selectedIntegration.type.value;
        }

        if (scope.selectedIntegration.type === 'zendesk') {
          if (_.has(scope.selectedIntegration, 'properties.token')) {
            delete scope.selectedIntegration.properties.token;
          }

          if (!_.has(scope.selectedIntegration, 'properties.workItems') || scope.selectedIntegration.properties.workItems === '') {
            scope.selectedIntegration.properties.workItems = false;
          }
        }
      };

      return Integration;
    }
  ]);
