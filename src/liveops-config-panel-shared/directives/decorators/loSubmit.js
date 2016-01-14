'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmit', ['$q', '$parse', function ($q, $parse) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit', '?^loFormCancel', '?^loFormReset', '?^loFormAlert'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        var loFormReset = $ctrl[2];
        var loFormAlert = $ctrl[3];

        $elem.bind($attrs.event, function () {
          var ngDisabled = $parse($attrs.ngDisabled)($scope);
          if(!!ngDisabled){
            return;
          }

          //TODO check if $attrs.loSubmit is actually a thing that return resource
          var promise = $q.when($scope.$eval($attrs.loSubmit));

          promise = promise.then(function(resource) {
            if(loFormCancel) {
              loFormCancel.resetForm();
            } else if(loFormReset) {
              loFormReset.resetForm();
            }

            return resource;
          },
          function(error) {
            var def = $q.defer();
            
            if (loFormSubmit){
              loFormSubmit.populateApiErrors(error);
            }
            
            def.reject(error);
            return def.promise;
          });
          
          if (loFormAlert){
            promise = promise.then(function(resource) {
              loFormAlert.alertSuccess(resource);
            }, 
            function(error) {
              loFormAlert.alertFailure(error.config.data);
            });
          }
          
          $scope.$apply();
        });
      }
    };
  }]);
