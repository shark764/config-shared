'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Branding', ['$rootScope', 'LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'stylesTransformer', 'saveStylesTransformer',
    function ($rootScope, LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, stylesTransformer, saveStylesTransformer) {

      var Branding = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/branding',
        resourceName: 'Branding',
        updateFields: [{
          name: 'logo',
          optional: true
        }, {
          name: 'favicon',
          optional: true
        }, {
          name: 'styles',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor,
        getResponseTransformer: stylesTransformer,
        putResponseTransformer: stylesTransformer,
        putRequestTransformer: saveStylesTransformer
      });

      Branding.prototype.delete = function(params) {
        var promise = Branding.prototype.$delete(params);

        promise.then(function(result) {
          return result;
        });

        return promise;
      };

      Branding.apply = function(params) {

        // Create a NEW and separate stylesheet for branding CSS overrides
        function createNewStylesheet() {
		var style = document.createElement('style');
		// WebKit hack :(
		style.appendChild(document.createTextNode(''));
		// Add the <style> element to the page
		document.head.appendChild(style);

		return style.sheet;
        }

        // Disable any existing overrides and create new sheet to reapply
        if ($rootScope.sheet) {
          $rootScope.sheet.disabled = true;
        }
        $rootScope.sheet = createNewStylesheet();

        // addCSSRule function for ease of inserts and default to addRule when insertRule is unavailable
        function addCSSRule(selector, rules, index) {
		if('insertRule' in $rootScope.sheet) {
			$rootScope.sheet.insertRule(selector + '{' + rules + '}', index);
		}
		else if('addRule' in $rootScope.sheet) {
			$rootScope.sheet.addRule(selector, rules, index);
		}
        }

        var stylesheetIndex = $rootScope.sheet.rules.length;

        // CSS Overides for branding below
        var navColor = params.styles.navbar;
        var navTextColor = params.styles.navbarText;

        if (navColor) {
          addCSSRule('#topnav', 'background-color: ' + navColor + '!important', stylesheetIndex);
          addCSSRule('#topnav .fa-caret-down', 'color: ' + navColor + '!important', stylesheetIndex);
        }
        if (navTextColor) {
          addCSSRule('#topnav .drop-label', 'color: ' + navTextColor + '!important', stylesheetIndex);
          addCSSRule('#topnav .drop-label:hover', 'color: ' + navTextColor + '!important', stylesheetIndex);
        }

      };

      return Branding;
    }
  ]);
