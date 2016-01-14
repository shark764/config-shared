'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('loFormResetController', ['$scope', '$timeout', 'modelResetService', 'DirtyForms',
    function ($scope, $timeout, modelResetService, DirtyForms) {
      var vm = this;
      vm.resetForm = function () {
        //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
        //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
        angular.forEach(vm.formController, function (value, key) {
          if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
            var displayValue = value.$modelValue;
            if (displayValue === null) {
              displayValue = undefined;
            }

            vm.formController[key].$setViewValue(displayValue);
            vm.formController[key].$rollbackViewValue();
          }
        });

        vm.formController.$setPristine();
        vm.formController.$setUntouched();
      };

      vm.resetErrors = function () {
        for (var errorIndex in vm.formController.$error) {
          var errorFields = vm.formController.$error[errorIndex];

          for (var errorFieldIndex = 0; errorFieldIndex < errorFields.length; errorFields++) {
            var error = errorFields[errorFieldIndex];
            error.$setValidity(errorIndex, true);
          }
        }
      };

      vm.reset = function reset(model) {
        modelResetService.reset(model);
        vm.resetForm(vm.formController);
      };

      vm.onEvent = function (model) {
        DirtyForms.confirmIfDirty(function () {
          return $timeout(function(){
            return vm.reset(model);
          });
        });
      };
    }
  ]);
