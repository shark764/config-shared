'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormCancel', ['$parse', 'DirtyForms', '$timeout', '$rootScope',
    function ($parse, DirtyForms, $timeout, $rootScope) {
      return {
        restrict: 'A',
        require: ['ngResource', 'form', '^loDetailsPanel'],
        controller: function($scope) {
          var self = this;
          //TODO: Consider loFormReset loReset instead. This one introduces too much coupling.
          this.resetForm = function () {
            //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
            //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
            angular.forEach(self.formController, function (value, key) {
              if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
                var displayValue = value.$modelValue;
                if (displayValue === null) {
                  displayValue = undefined;
                }

                self.formController[key].$setViewValue(displayValue);
                self.formController[key].$rollbackViewValue();
              }
            });

            self.formController.$setPristine();
            self.formController.$setUntouched();
          };

          this.cancel = function () {
            var resource = $parse(this.ngResource)($scope);
            if (resource.isNew() || !this.formController.$dirty) {
             this.loDetailsPanelController.close();
            } else {
              DirtyForms.confirmIfDirty(function () {
                $rootScope.$broadcast('cancel:resource:' + resource.resourceName);
                resource.reset();
                $timeout(function(){
                  self.resetForm(self.formController);
                });
              });
            }
          };
        },
        link: function ($scope, $elem, $attrs, $ctrl) {
          $scope.$watch($attrs.ngResource, function(newResource, oldResource) {
            if(oldResource) {
              try {
                oldResource.reset();
              } catch (e) {
                // Maybe use this clause if we need to broadcast/emit something to address this,
                // but right now I have had to implement this to counter a JS error resulting from the
                // angular moment picker on the do not call lists details panel not clearing upon
                // the closing of the panel as it should be. Perhaps a better solution exists...?
              }
            }

            var form = $parse($attrs.name)($scope);
            var controller = $elem.data('$loFormCancelController');
            controller.resetForm(form);
          });

          var controller = $elem.data('$loFormCancelController');
          controller.ngResource = $attrs.ngResource;
          controller.formController = $ctrl[1];
          controller.loDetailsPanelController = $ctrl[2];
        }
      };
    }
  ]);
