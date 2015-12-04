'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loReset', ['$q', '$parse', '$timeout', 'DirtyForms', 'modelResetService',
    function ($q, $parse, $timeout, DirtyForms, modelResetService) {
      return {
        restrict: 'A',
        require: ['^form', 'ngModel'],
        controller: function($scope) {
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
          
          vm.reset = function reset(model) {
            modelResetService.reset(model);
            vm.resetForm(vm.formController);
          };
          
          vm.onEvent = function (model) {
            model = model ? model : vm.ngModel.$modelValue;
            DirtyForms.confirmIfDirty(function () {
              return $timeout(function(){
                return vm.reset(model)
              });
            });
          };
        },
        
        link: function (scope, elem, attrs, ctrls) {
          var controller = elem.data('$loResetController');
          controller.formController = ctrls[0];
          controller.ngModel = ctrls[1];
          
          if(attrs.name) {
            $parse(attrs.name).assign(scope, controller)
          }
          
          attrs.event = angular.isDefined(attrs.event) ? attrs.event : 'click';
          elem.bind(attrs.event, function () {
            var promise = $q.when(scope.$eval(attrs.loReset));

            promise.then(function (model) {
              controller.onEvent(model);
            });

            scope.$apply();
          });
        }
      };
    }
  ]);