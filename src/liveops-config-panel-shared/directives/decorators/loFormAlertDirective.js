'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormAlert', ['$parse', 'Alert', '$translate',
    function ($parse, Alert,$translate) {
      return {
        restrict: 'A',
        require: ['loFormSubmit'],
        controller: function() {
          this.alertSuccess = function(resource) {
            if (! resource){
              return;
            }

            var action = resource.updated ? 'updated' : 'saved';
            Alert.success('Record ' + action);
          };

          this.alertFailure = function(resource) {
            if (! resource){
              return;
            }
            var action = resource.updated ? 'update' : 'save';
            var wordsRes = ["limit", "null", "q", "page", "sortField", "sortOrder"];

            if (wordsRes.indexOf(resource.objectName) !== -1) {
              var errorMsg = '"' + resource.objectName + '" ' +  $translate.instant('loFormAlert.reservedWord');
              Alert.error(errorMsg);
              return;
            }

            Alert.error('Record failed to ' + action);
          };
        },
        link: function ($scope, elem) {
          $scope.$on('form:submit:success', function(event, resource) {
            var controller = elem.data('$loFormAlertController');
            controller.alertSuccess(resource);
          });

          $scope.$on('form:submit:failure', function(event, resource) {
            var controller = elem.data('$loFormAlertController');
            controller.alertFailure(resource);
          });
        }
      };
    }
  ]);
