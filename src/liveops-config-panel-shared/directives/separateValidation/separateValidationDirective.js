'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('separateValidation', [function () {
    return {
      restrict: 'A',
      require: '?form',
      link: function link($scope, element, iAttrs, formController) {

        if (! formController) {
          return;
        }

        // Remove this form from parent controller
        var parentFormController = element.parent().controller('form');

        if(parentFormController){
          parentFormController.$removeControl(formController);
        }
        
        // Replace form controller with a "null-controller"
        var nullFormCtrl = {

          $setValidity: function () {
            formController.$invalid = false;
            angular.forEach(element.find('input'), function (ele){
              if(formController[ele.name] && formController[ele.name].$error) {
                for (var prop in formController[ele.name].$error){
                  if(prop && formController[ele.name].$error[prop]) {
                    formController.$invalid = true;
                    break;
                  }
                }
              }

            });

          },
          $setDirty: function () {
            formController.$dirty = true;
          },
          $setPristine: function (value) {
            formController.$pristine = value;
          }
        };

        angular.extend(formController, nullFormCtrl);
      }
    };
  }]);