'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.shared.config')

.constant('jsedn', window.jsedn)

.constant('_', window._)

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.constant('apiErrorKeys', ['required'])

;
