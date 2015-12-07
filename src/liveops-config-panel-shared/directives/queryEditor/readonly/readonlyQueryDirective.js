'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('readonlyQuery', function () {
    return {
      restrict : 'E',
      scope : {
        query : '='
      },
      transclude : true,
      controller : function ($scope, ZermeloQuery) {

        $scope.$watch('query', function (nv) {
          $scope.ednQuery = ZermeloQuery.fromEdn(nv);
          $scope.showBasicQuery = !!$scope.ednQuery;
        });

      },
      link : function ($scope, element, attrs, ctrl, transclude) {
        transclude($scope, function (clone) {
          element.append(clone);
        });
      }
    };
  });
