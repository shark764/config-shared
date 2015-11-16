'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('validateCount', [function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link($scope, element, attrs, ngModel) {
        $scope.$watchCollection(attrs.ngModel, function (newCollection) {
          if(newCollection) {
            ngModel.$setValidity(attrs.name, !!newCollection.length);
          } else {
            ngModel.$setValidity(attrs.name, false);
          }
        });
      }
    };
  }]);
