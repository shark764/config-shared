(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationQueryEditorController', ['$scope', 'ZermeloEscalationQuery', 'ZermeloObjectGroup',
       '_', '$translate', 'Modal', function ($scope, ZermeloEscalationQuery, ZermeloObjectGroup, _, $translate, Modal) {

      var vm = this;
      vm.escalationQuery = $scope.escalationQuery;

      vm.addGroup = function (key) {
        vm.escalationQuery.setGroup(key, new ZermeloObjectGroup());
        vm.possibleGroups.splice(vm.possibleGroups.indexOf(key), 1);
        vm.currentGroup = '';
      };

      vm.verifyRemoveGroup = function (key) {
        if(vm.escalationQuery.getGroup(key).objectGroup.hasConditions()) {
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
        vm.escalationQuery.removeGroup(key);
        vm.possibleGroups.push(key);
      };

      vm.possibleGroups = _.xor(_.pluck(vm.escalationQuery.groups, 'key'), ZermeloEscalationQuery.ALLOWED_KEYS);
      vm.isAdvancedMode = false;
    }]);

})();
