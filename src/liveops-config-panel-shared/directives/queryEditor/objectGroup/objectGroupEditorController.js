(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ObjectGroupEditorController', ['$scope', '$translate', 'Session', 'Skill', 'Group', 'TenantUser',
      function ($scope, $translate, Session, Skill, Group, TenantUser) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
      vm.readonly = $scope.readonly;

      switch (vm.key) {
        case ':skills':
          vm.modelType = Skill;
          break;
        case ':groups':
          vm.modelType = Group;
          break;
        case ':id':
          vm.modelType = TenantUser;
          break;
      }

      vm.items = vm.modelType.cachedQuery({
          tenantId: Session.tenant.tenantId
      });
    }]);

})();
