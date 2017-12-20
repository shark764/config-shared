'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('IdentityProviders', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', '$translate',
    function (LiveopsResourceFactory, apiHostname, Session, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, $translate) {
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
          name: $translate.instant('identityProviders.details.selectedIdpConfigInfoType.sharedIdentityProviderAccessCode'),
          val: 'sharedIdentityProviderLinkId'
        }
      ];

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
        // if the user has selected an XML file AND they also have selected
        // the xml option in the dropdown when saving, get rid of the
        // metadataUrl value
        if (
          scope.idp.selectedIdentityProvider.metadataFile &&
          scope.idp.newFileUploaded &&
          scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType === 'xml'
        ) {
          delete scope.idp.selectedIdentityProvider.metadataUrl;
        }

        if (scope.idp.selectedIdentityProvider.inEditMode) {
          delete scope.idp.selectedIdentityProvider.inEditMode;
        }

        if (scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType) {
          delete scope.idp.selectedIdentityProvider.selectedIdpConfigInfoType;
        }
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

      return IdentityProviders;
    }
  ]);
