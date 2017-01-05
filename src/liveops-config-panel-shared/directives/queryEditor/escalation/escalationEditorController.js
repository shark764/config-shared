(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationEditorController', ['$scope', 'ZermeloCondition', 'ZermeloObjectGroup',
      'ZermeloEscalationList', '_', '$translate', function ($scope,
        ZermeloCondition, ZermeloObjectGroup, ZermeloEscalationList, _, $translate) {

      var vm = this;

      vm.forms = {};
      vm.escalation = $scope.escalation;
      vm.afterSecondsMultiplier = 1;
      vm.timeAmount = vm.escalation.afterSecondsInQueue;
      vm.minSecondsRequired = $scope.minSeconds;
      vm.previousEscalation = $scope.previousEscalation;

      if(vm.escalation.afterSecondsInQueue) {
        vm.afterSecondsMultiplier = vm.escalation.afterSecondsInQueue % 60 === 0 ? 60 : 1;
        vm.afterTimeInQueue = vm.escalation.afterSecondsInQueue / vm.afterTimeMultiplier;
      }

      $scope.$watch('previousEscalation.afterSecondsInQueue', function () {
        vm.checkMinValue();
      });

      vm.checkMinValue = function () {
        if(vm.escalation && vm.forms.timeAfterForm && vm.forms.timeAfterForm.amount) {
          var validity = vm.previousEscalation.afterSecondsInQueue < vm.escalation.afterSecondsInQueue;
          vm.forms.timeAfterForm.amount.$setValidity('minTime', validity);

          if(!validity) {
            vm.forms.timeAfterForm.amount.$setTouched();
          }
        }
      };

      vm.afterTimeOptions = [
        {
          label: $translate.instant('queue.details.priorityUnit.seconds'),
          value: 1
        },
        {
          label: $translate.instant('queue.details.priorityUnit.minutes'),
          value: 60
        }
      ];

      vm.updateMultiplier = function () {
        switch (vm.afterSecondsMultiplier) {
          case 1:
            vm.timeAmount = vm.timeAmount * 60;
            break;
          case 60:
            vm.timeAmount = Math.ceil(vm.timeAmount / 60);
            break;
        }

        vm.updateTimeInSeconds();
      };

      vm.updateTimeInSeconds = function () {
        vm.escalation.afterSecondsInQueue = vm.timeAmount * vm.afterSecondsMultiplier;
        vm.checkMinValue();
      };

      vm.minTimeRequired = function (multiplier) {
        return vm.minSecondsRequired / multiplier;
      };
    }]);

})();
