(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ReadonlyQueryController', ['$scope', 'ZermeloQueryList',
      function ($scope, ZermeloQueryList) {
        $scope.$watch('query', function (nv) {
          $scope.ednQuery = ZermeloQueryList.fromEdn(nv);
          $scope.showBasicQuery = !!$scope.ednQuery;
        });
      }]);
})();
