(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ObjectGroupEditorController', ['$scope', '$translate', 'Session', 'Skill', 'Group', 'TenantUser', 'ZermeloEscalationQuery',
      function ($scope, $translate, Session, Skill, Group, TenantUser, ZermeloEscalationQuery) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
      vm.readonly = $scope.readonly;
      vm.modelType = ZermeloEscalationQuery.KEY_OBJECTS[vm.key]; 
      vm.items = vm.modelType.cachedQuery({
          tenantId: Session.tenant.tenantId
      });
    }]);

})();
