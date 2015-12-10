(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('QueryCreatorController', ['$scope', 'ZermeloCondition', 'ZermeloObjectGroup',
      'ZermeloQuery', '_', '$translate', 'Modal', function ($scope,
        ZermeloCondition, ZermeloObjectGroup, ZermeloQuery, _, $translate, Modal) {

      var vm = this;

      vm.forms = {};
      vm.query = $scope.query;
      vm.afterSecondsMultiplier = 1;
      vm.timeAmount = vm.query.afterSecondsInQueue;
      vm.minSecondsRequired = $scope.minSeconds;
      vm.previousQuery = $scope.previousQuery;

      if(vm.query.afterSecondsInQueue) {
        vm.afterSecondsMultiplier = vm.query.afterSecondsInQueue % 60 === 0 ? 60 : 1;
        vm.afterTimeInQueue = vm.query.afterSecondsInQueue / vm.afterTimeMultiplier;
      };

      $scope.$watch('previousQuery.afterSecondsInQueue', function () {
        vm.checkMinValue();
      });

      vm.checkMinValue = function () {
        if(vm.previousQuery && vm.forms.timeAfterForm && vm.forms.timeAfterForm.amount) {
          var validity = vm.previousQuery.afterSecondsInQueue < vm.query.afterSecondsInQueue;
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
        vm.query.afterSecondsInQueue = vm.timeAmount * vm.afterSecondsMultiplier;
        vm.checkMinValue();
      };

      vm.minTimeRequired = function (multiplier) {
        return vm.minSecondsRequired / multiplier;
      };

      vm.addGroup = function (key) {
        vm.query.setGroup(key, new ZermeloObjectGroup());
        vm.possibleGroups.splice(vm.possibleGroups.indexOf(key), 1);
        vm.currentGroup = '';
      };

      vm.verifyRemoveGroup = function (key) {
        if(vm.query.getGroup(key).objectGroup.hasConditions()) {
          return Modal.showConfirm(
            {
              message: $translate.instant('queue.query.builder.remove.filter.confirm'),
              okCallback: function () {
                vm.removeGroup(key);
              }
            }
          );
        }

        return vm.removeGroup(key);
      };

      vm.removeGroup = function(key) {
        vm.query.removeGroup(key);
        vm.possibleGroups.push(key);
      };

      vm.possibleGroups = _.xor(_.pluck(vm.query.groups, 'key'), ZermeloQuery.ALLOWED_GROUP_KEYS);
      vm.isAdvancedMode = false;
    }]);

})();
