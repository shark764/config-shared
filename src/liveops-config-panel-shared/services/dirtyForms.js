'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('DirtyForms', ['Alert', '$translate', function(Alert, $translate) {
    var self = this;
    this.forms = [];

    this.hasDirty = function() {
      var hasDirty = false;
      angular.forEach(self.forms, function(form) {
        if (form.$dirty) {
          hasDirty = true;
        }
      });

      return hasDirty;
    };

    this.registerForm = function(form) {
      self.forms.push(form);
    };

    this.removeForm = function(form) {
      self.forms.removeItem(form);
    };

    this.confirmIfDirty = function(actionFunction) {
      if (self.hasDirty()) {
        Alert.confirm($translate.instant('unsavedchanges.nav.warning'),
          actionFunction,
          angular.noop
        );
      } else {
        actionFunction();
      }
    };
  }]);
