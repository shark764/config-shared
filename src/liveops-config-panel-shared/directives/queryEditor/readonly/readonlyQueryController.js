(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('ReadonlyQueryController', ['$scope', 'ZermeloQuery',
      function ($scope, ZermeloQuery) {
        $scope.$watch('query', function (nv) {
          $scope.ednQuery = ZermeloQuery.fromEdn(nv);
          $scope.showBasicQuery = !!$scope.ednQuery;
        });
      }]);
})();
