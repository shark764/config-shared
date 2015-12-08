'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('readonlyQuery', function () {
    return {
      restrict : 'E',
      scope : {
        query : '='
      },
      transclude : true,
      controller : 'ReadonlyQueryController',
      link : function ($scope, element, attrs, ctrl, transclude) {
        transclude($scope, function (clone) {
          element.append(clone);
        });
      }
    };
  });
