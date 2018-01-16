'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('IdentityProviders', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', '$translate', 'jwtHelper', 'Me', '$q',
    function (LiveopsResourceFactory, apiHostname, Session, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, $translate, jwtHelper, Me, $q) {
      /* globals Blob, URL */

      var IdentityProviders = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/identity-providers/:id',
        resourceName: 'IdentityProviders',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'active'
        }, {
          name: 'identityProvider',
          optional: true
        }, {
          name: 'metadataUrl',
          optional: true
        }, {
          name: 'metadataFile',
          optional: true
        }, {
          name: 'emailMapping',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      IdentityProviders.prototype.getDisplay = function () {
        return this.name;
      };

      IdentityProviders.prototype.idpConfigInfoTypes = [
        {
          name: $translate.instant('identityProviders.details.selectedIdpConfigInfoType.url'),
          val: 'url'
        },
        {
          name: $translate.instant('identityProviders.details.selectedIdpConfigInfoType.xml'),
          val: 'xml'
        },
        {
          name: $translate.instant('identityProviders.details.selectedIdpConfigInfoType.xmlDirectInput'),
          val: 'xmlDirectInput'
        },
        {
          name: $translate.instant('identityProviders.details.selectedIdpConfigInfoType.sharedIdentityProviderAccessCode'),
          val: 'sharedIdentityProviderLinkId'
        }
      ];

      IdentityProviders.prototype.setConfigType = function (selectedIdentityProvider) {
        if (selectedIdentityProvider.selectedIdpConfigInfoType === 'xmlDirectInput') {
          return;
        }

        if (selectedIdentityProvider.metadataUrl) {
          selectedIdentityProvider.selectedIdpConfigInfoType = 'url'
        } else {
          selectedIdentityProvider.selectedIdpConfigInfoType = 'xml'
        }
      };

      /* jshint ignore:start */
      IdentityProviders.prototype.parseXmlFile = function (scope) {
        var file = document.getElementById('xml-file-input').files[0];
        var reader = new FileReader();

        reader.onloadend = function(e) {
          scope.idp.selectedIdentityProvider.metadataFile = e.target.result;
          scope.idp.selectedIdentityProvider.metadataFileName = file.name;
          scope.idp.selectedIdentityProvider.inEditMode = true;
          scope.idp.newFileUploaded = true;
        };

        if (file) {
          reader.readAsText(file);
        }
      };
      /* jshint ignore:end */

      IdentityProviders.prototype.deleteExtraneousProps = function (scope) {
        // if the user has selected an XML file -OR- XML direct upload
        // AND they also have selected the xml option in the dropdown
        // when saving, get rid of the metadataUrl value
        if (
          scope.idp.selectedIdentityProvider.metadataFile &&
          (
            scope.idp.newFileUploaded &&
            scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType === 'xml'
          ) ||
            (
              scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType === 'xmlDirectInput' &&
              _.has(scope.forms.detailsForm, 'xmlDirectInput.$pristine') &&
              !scope.forms.detailsForm.xmlDirectInput.$pristine
            )
        ) {
          delete scope.idp.selectedIdentityProvider.metadataUrl;
        }

        if (scope.idp.selectedIdentityProvider.inEditMode) {
          delete scope.idp.selectedIdentityProvider.inEditMode;
        }

        if (scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType) {
          delete scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType;
        }

        delete scope.idp.selectedIdentityProvider.inEditMode;
        delete scope.idp.selectedIdentityProvider.isReadonly;
      };

      IdentityProviders.prototype.downloadConfig = function (doc, idpName) {
        var fileToExport = new Blob([doc], {
          type: 'text/xml'
        });

        var a = document.createElement('a');
        a.href = URL.createObjectURL(fileToExport);
        a.target = '_blank';
        a.download = idpName + '_configuration.xml';
        a.click();
      };

      IdentityProviders.prototype.isActiveIdp = function (ipdId) {
        var deferred = $q.defer();
        var decodedToken = jwtHelper.decodeToken(Session.token);

        // find tenant in myTenants that matches Session.tenant.tenantId
        var myTenants = Me.cachedQuery();
        return myTenants.$promise.then(function (tenants) {
          // find the idp in identityProviders that matches the idpId argument
          var currentTenant = _.find(tenants, {
            tenantId: Session.tenant.tenantId
          });

          // if the current tenant has a clientId that matches the client_id we are
          // getting from the decoded token, then it means that the currently
          // selected Idp is what we are currently logged in with, so return a boolean
          // value we can use as a flag to disable the toggle switch
          var isCurrentIdp = _.some(currentTenant.identityProviders, {
            'id': ipdId,
            'client': decodedToken.client_id // jshint ignore:line
          });

          deferred.resolve(isCurrentIdp);
          return deferred.promise;
        });
      };

      return IdentityProviders;
    }
  ]);
