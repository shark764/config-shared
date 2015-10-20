(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('liveopsConfigPanel.shared.config', [])
      .value('liveopsConfigPanel.shared.config', {
          debug: true
      });

  // Modules
  angular.module('liveopsConfigPanel.shared.directives', []);
  angular.module('liveopsConfigPanel.shared.filters', []);
  angular.module('liveopsConfigPanel.shared.services', []);
  angular.module('liveopsConfigPanel.shared',
      [
          'liveopsConfigPanel.shared.config',
          'liveopsConfigPanel.shared.directives',
          'liveopsConfigPanel.shared.filters',
          'liveopsConfigPanel.shared.services',
          'ngResource'
      ]);

})(angular);
