'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loSubmitChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chain = Chain.get($attrs.loSubmitChainExecutor);
          
          chain.hook('post form submit', {
            success: function(resource) {
              $ctrl[0].resetForm();
              return resource;
            },
            failure: function(error) {
              $ctrl[0].populateApiErrors(error);
              return error;
            }
          });

          chain.hook('emit event', {
            success: function(resource) {
              $scope.$emit('form:submit:success', resource);
            },
            failure: function(error) {
              $scope.$emit('form:submit:failure', error);
            }
          });
          
          chain.execute();
          $scope.$apply();
        });
      }
    };
  }]);
