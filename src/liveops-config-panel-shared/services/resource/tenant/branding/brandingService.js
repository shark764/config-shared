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

        function colorLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = '#', c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ('00'+c).substr(c.length);
		}

		return rgb;
        }

        // CSS Overides for branding below
        var stylesheetIndex = $rootScope.sheet.rules.length;
        var navColor = params.styles.navbar;
        var navTextColor = params.styles.navbarText;

        if (navColor) {
          addCSSRule('#topnav', 'background-color: ' + navColor + '!important', stylesheetIndex);
          addCSSRule('#topnav .fa-caret-down', 'color: ' + navColor + '!important', stylesheetIndex);
        }
        if (navTextColor) {
          var darkerTextColor = colorLuminance(navTextColor, -0.2);
          addCSSRule('#topnav .drop-label', 'color: ' + darkerTextColor + '!important', stylesheetIndex);
          addCSSRule('#topnav #tenant-dropdown .drop-label div', 'border: 1px solid ' + darkerTextColor + '!important', stylesheetIndex);
          addCSSRule('#topnav .divider', 'border: 1px solid ' + darkerTextColor + '!important', stylesheetIndex);
          addCSSRule('#welcome i', 'color: ' + darkerTextColor + '!important', stylesheetIndex);
          addCSSRule('#helpMenu i', 'color: ' + darkerTextColor + '!important', stylesheetIndex);

          addCSSRule('#topnav > ul > li.active .drop-label span, #topnav > ul > li.active #logo, #topnav > ul > li:hover .drop-label span, #topnav > ul > li:hover #logo', 'color: ' + navTextColor + '!important', stylesheetIndex);
          addCSSRule('#topnav > ul > li:not(#welcome):not(#helpMenu):hover .label-icon', 'color: ' + navTextColor + '!important', stylesheetIndex);
          addCSSRule('#welcome:hover i', 'color: ' + navTextColor + '!important', stylesheetIndex);
          addCSSRule('#helpMenu i:hover', 'color: ' + navTextColor + '!important', stylesheetIndex);
        }

      };

      return Branding;
    }
  ]);
