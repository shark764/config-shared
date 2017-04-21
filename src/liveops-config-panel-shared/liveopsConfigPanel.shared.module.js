'use strict';

(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('liveopsConfigPanel.shared.config', [])
    .value('liveopsConfigPanel.shared.config', {
      debug: true
    })
    .value('apiHostname', 'placeholder')
    .value('s3BucketUrl', 'placeholder');

  // Modules
  angular.module('liveopsConfigPanel.shared.directives', [
    'liveopsConfigPanel.shared.services',
    'liveopsConfigPanel.shared.filters'
  ]);
  angular.module('liveopsConfigPanel.shared.filters', [
    'angular-toArrayFilter'
  ]);
  angular.module('liveopsConfigPanel.shared.services', [
    'toastr',
    'ngLodash',
    'ngResource',
    'pascalprecht.translate',
    'liveopsConfigPanel.shared.config'
  ]);
  angular.module('liveopsConfigPanel.shared', [
    'liveopsConfigPanel.shared.config',
    'liveopsConfigPanel.shared.directives',
    'liveopsConfigPanel.shared.filters',
    'liveopsConfigPanel.shared.services'
  ]);

})(angular);
