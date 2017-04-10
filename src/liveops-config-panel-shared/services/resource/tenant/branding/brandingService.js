'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Branding', ['$rootScope', '$state', 'LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'emitErrorInterceptor', 'cacheAddInterceptor', 'stylesTransformer', 'saveStylesTransformer',
    function ($rootScope, $state, LiveopsResourceFactory, apiHostname, emitInterceptor, emitErrorInterceptor, cacheAddInterceptor, stylesTransformer, saveStylesTransformer) {

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

      // Create a NEW and separate stylesheet for branding CSS overrides
      function createNewStylesheet() {
        var style = document.createElement('style');
        // WebKit hack :(
        style.appendChild(document.createTextNode(''));
        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
      }

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

      Branding.apply = function(params) {

        // --- Product Name ---
        $rootScope.productName = (params.styles && params.styles.productName) ? params.styles.productName : 'CxEngage';
        $rootScope.title = $state.current.title + ' | ' + $rootScope.productName;

        // --- Logo / Favicon ---

        $rootScope.s3bucketUrl = 'https://cxengagelabs-dev-configurator-images.s3.amazonaws.com/';

        $rootScope.logo = params.logo ? $rootScope.s3bucketUrl + params.logo : 'assets/images/cxengage_white.png';
        $rootScope.favicon32 = params.favicon ? $rootScope.s3bucketUrl + params.favicon : 'favicon-32x32.png';
        $rootScope.favicon16 = params.favicon ? $rootScope.s3bucketUrl + params.favicon : 'favicon-16x16.png';

        // --- Brand Colors ---

        // Disable any existing overrides and create new sheet to reapply
        if ($rootScope.sheet) {
          $rootScope.sheet.disabled = true;
        }

        if (params && params.styles) {

          $rootScope.sheet = createNewStylesheet();

          // CSS Overides for branding below
          var stylesheetIndex = $rootScope.sheet.rules.length;
          var navColor = params.styles.navbar;
          var navTextColor = params.styles.navbarText;
          var primaryColor = params.styles.primaryColor;
          var accentColor = params.styles.accentColor;
          var accentHoverColor = params.styles.accentHoverColor;

          if (navColor) {
            addCSSRule('#topnav, .logo-preview img', 'background-color: ' + navColor + '!important', stylesheetIndex);
            addCSSRule('#topnav .fa-caret-down', 'color: ' + navColor + '!important', stylesheetIndex);
            addCSSRule('.lo-alert', 'border: 2px solid' + navColor + '!important', stylesheetIndex);
            addCSSRule('.lo-gradient-squares', 'background: ' + navColor + '!important', stylesheetIndex);
            addCSSRule('.lo-gradient-squares', 'background-image: none !important', stylesheetIndex);
          }
          if (navTextColor) {
            var darkerTextColor = colorLuminance(navTextColor, -0.2);
            addCSSRule('#topnav .drop-label, #welcome i, #helpMenu i', 'color: ' + darkerTextColor + '!important', stylesheetIndex);
            addCSSRule('#topnav #tenant-dropdown .drop-label div, #topnav .divider', 'border: 1px solid ' + darkerTextColor + '!important', stylesheetIndex);

            addCSSRule('#topnav > ul > li.active .drop-label span, #topnav > ul > li.active #logo, #topnav > ul > li:hover .drop-label span, #topnav > ul > li:hover #logo', 'color: ' + navTextColor + '!important', stylesheetIndex);
            addCSSRule('#topnav > ul > li:not(#welcome):not(#helpMenu):hover .label-icon', 'color: ' + navTextColor + '!important', stylesheetIndex);
            addCSSRule('#welcome:hover i, #helpMenu i:hover', 'color: ' + navTextColor + '!important', stylesheetIndex);

          }
          if (primaryColor) {
            addCSSRule('#create-btn, .fa-search, #submit-details-btn', 'background-color: ' + primaryColor + '!important', stylesheetIndex);
            addCSSRule('.lo-main-text, .btn:not(.btn-primary)', 'color: ' + primaryColor + '!important', stylesheetIndex);
            addCSSRule('#login-wrapper .btn, #reset-form .btn', 'border-color: ' + primaryColor + '!important', stylesheetIndex);
            addCSSRule('#login-wrapper .btn, #reset-form .btn', 'background-color: ' + primaryColor + '!important', stylesheetIndex);
          }
          if (accentColor) {
            addCSSRule('.lo-accent-text i', 'color: ' + accentColor + '!important', stylesheetIndex);
            addCSSRule('#topnav > ul > li.active .drop-label span, #topnav > ul > li.active #logo, #topnav > ul > li:hover #logo, #topnav > ul > li:not(#welcome):not(#helpMenu):hover dropdown:not(#tenant-dropdown) .drop-label span', 'box-shadow: inset 0px -5px 0px 0px ' + accentColor + '!important', stylesheetIndex);
            addCSSRule('.lo-accent-hover-box-border:hover', 'box-shadow: inset 4px 0px 0px 0px ' + accentColor + '!important', stylesheetIndex);
            addCSSRule('.lo-accent-hover-border:hover', 'border-color: ' + accentColor + '!important', stylesheetIndex);
            addCSSRule('#login-wrapper .btn', 'border-color: ' + accentColor + '!important', stylesheetIndex);
          }
          if (accentHoverColor) {
            addCSSRule('#items-table tr:hover, #items-table .lo-highlight, .dropdown-container a:hover, .lo-hover-highlight:hover, .lo-alert, .list-editor .list-body ul li .dispoDropdown ul li:hover', 'background-color: ' + accentHoverColor + '!important', stylesheetIndex);
            addCSSRule('.lo-alert', 'color: ' + '#656565' + '!important', stylesheetIndex);
          }
        }
      };

      return Branding;
    }
  ]);
