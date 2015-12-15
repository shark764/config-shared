'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loReset', ['$q', '$parse',
    function ($q, $parse) {
      return {
        restrict: 'A',
        require: ['^form', 'ngModel'],
        controller: 'loFormResetController',
        link: function (scope, elem, attrs, ctrls) {
          var controller = elem.data('$loResetController');
          controller.formController = ctrls[0];
          controller.ngModel = ctrls[1];
          
          if(attrs.name) {
            $parse(attrs.name).assign(scope, controller);
          }
          
          attrs.event = angular.isDefined(attrs.event) ? attrs.event : 'click';
          elem.bind(attrs.event, function () {
            var promise = $q.when(scope.$eval(attrs.loReset));

            promise.then(function (model) {
              model = model ? model : controller.ngModel.$modelValue;
              controller.onEvent(model);
            });

            scope.$apply();
          });
        }
      };
    }
  ]);