(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ReadonlyQueryController', ['$scope', 'ZermeloEscalationList',
      function ($scope, ZermeloEscalationList) {
        $scope.$watch('query', function (nv) {
          $scope.ednQuery = ZermeloEscalationList.fromEdn(nv);
          $scope.showBasicQuery = !!$scope.ednQuery;
        });
      }]);
})();
