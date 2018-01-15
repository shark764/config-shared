'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', '$translate',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, $translate) {

      function removeListOfProps(obj, arrayOfProps, importedScope) {
        importedScope.selectedIntegration.properties = _.pick(obj, arrayOfProps);
      }

      var salesforceProps = [
        'consumerKey',
        'consumerSecret',
        'loginUrl',
        'password',
        'securityToken',
        'username'
      ];

      var serenovaVoiceProps = [
        'accountId',
        'apiKey'
      ];

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

      var self = Integration.prototype;

      Integration.prototype.getDisplay = function () {
        if (this.type === 'serenova-voice') {
          return $translate.instant('integration.gvn.displayName');
        }

        return this.type;
      };

      Integration.prototype.authenticationTypes = [
        {
          name: $translate.instant('integration.details.properties.basicAuth'),
          val: 'basic'
        },
        {
          name: $translate.instant('integration.details.properties.tokenAuth'),
          val: 'token'
        },
        {
          name: $translate.instant('integration.details.properties.noAuth'),
          val: 'noAuth'
        }
      ];

      Integration.prototype.handleAuthMethodSelect = function (scope, authMethod, selectedAuthMethod, initialLoad) {
        // the conditional statement below allows  for situations where
        // we have to pass the integration data as opposed to the scope of the controller
        if (scope.hasOwnProperty('id')) {
          scope.selectedIntegration = scope;
        }

        // set the correct authentication method immediately on page load
        if (initialLoad === 'true') {
          scope.selectedIntegration.authType = authMethod;
          return;
        }

        var selectAuthTypeObj = _.find(self.authenticationTypes, function (authType) {
          // using trim() here because we're relying on contents of an
          // html tag, and if the markup is ever reformatted, it could
          // add whitespace and prevent a match from being made here
          return authType.name === selectedAuthMethod.trim();
        });

        // set the right auth type of change, defaulting to basic if nothing
        // has been changed yet
        if (selectAuthTypeObj) {
          scope.selectedIntegration.authType = selectAuthTypeObj.val;
        } else {
          scope.selectedIntegration.authType = 'basic';
        }
      };

      Integration.prototype.deleteExtraneousData = function (scope) {
        // the conditional statement below allows for situations where
        // we have to pass just the integration data as opposed to the entire
        // scope of the controller. In the case of the bulk edits, we are working
        // with the entire scope.
        var dataWithoutScope = false;
        if (scope.hasOwnProperty('id')) {
          scope.selectedIntegration = scope;
          dataWithoutScope = true;
        }

        if (_.has(scope, 'selectedIntegration.properties.sdkVersion')) {
          delete scope.selectedIntegration.properties.sdkVersion;
        }

        if (scope.selectedIntegration.description === null) {
          delete scope.selectedIntegration.description;
        }

        // clear out the unnecessary auth data depending on the auth method's requirements
        if (scope.selectedIntegration.hasOwnProperty('authType')) {
          switch (scope.selectedIntegration.authType) {
            case 'token':
              scope.selectedIntegration.properties.username = scope.selectedIntegration.properties.password = '';
              break;
            case 'basic':
              scope.selectedIntegration.properties.token = '';
              break;
            case 'noAuth':
              scope.selectedIntegration.properties.username = scope.selectedIntegration.properties.password =
              scope.selectedIntegration.properties.token = '';
              break;
          }

          // we can get rid of authType as well, as it has served its purpose
          delete scope.selectedIntegration.authType;
        }

        // clear out unnecessary data on the rest of the integration object
        // (switch statement might seem odd for only one option, but setting this
        // up to be easy to add integrations in the future)
        var tempProps = angular.copy(scope.selectedIntegration.properties);

        switch(scope.selectedIntegration.type) {
          case 'salesforce':
            removeListOfProps(tempProps, salesforceProps, scope);
            break;

          case 'serenova-voice':
            removeListOfProps(tempProps, serenovaVoiceProps, scope);
            break;
        }

        // this is to account for when we are working with the entire scope
        // as opposed to just an individual integration object
        if (
          dataWithoutScope === false &&
          scope.selectedIntegration.type &&
          scope.selectedIntegration.type.hasOwnProperty('value')
        ) {
          scope.selectedIntegration.type = scope.selectedIntegration.type.value;
        }

        if (scope.selectedIntegration.type === 'salesforce') {
          removeListOfProps(tempProps, salesforceProps, scope);
        } else if (scope.selectedIntegration.type === 'serenova-voice') {
          removeListOfProps(tempProps, serenovaVoiceProps, scope);
        } else if (
          scope.selectedIntegration.type === 'zendesk' ||
          scope.selectedIntegration.type === 'verint'
        ) {
          if (_.has(scope.selectedIntegration, 'properties.token')) {
            delete scope.selectedIntegration.properties.token;
          }

          if (scope.selectedIntegration.type === 'verint') {
            if (_.has(scope.selectedIntegration, 'properties.endpointPrefix')) {
              delete scope.selectedIntegration.properties.endpointPrefix;
            }

            if (
              _.has(scope.selectedIntegration, 'properties.ctiEnabled') &&
              !scope.selectedIntegration.properties.ctiEnabled
            ) {
              scope.selectedIntegration.properties.ctiEndpoint = '';
            }
          }

          // make sure there is always a workItems value in order to prevent API error
          if (!_.has(scope.selectedIntegration, 'properties.workItems') || scope.selectedIntegration.properties.workItems === '') {
            if (scope.selectedIntegration.type === 'verint') {
              delete scope.selectedIntegration.properties.workItems;
            } else {
              scope.selectedIntegration.properties.workItems = false;
            }
          }
        // and if it isn't a zendesk integration, make sure we are NOT saving the
        // workItems property
        } else {
          if (_.has(scope.selectedIntegration, 'properties.workItems')) {
            delete scope.selectedIntegration.properties.workItems;
          }
        }
      };

      return Integration;
    }
  ]);
