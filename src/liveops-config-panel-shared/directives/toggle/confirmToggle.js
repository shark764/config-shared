'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('confirmToggle', ['Modal', '$q', 'Alert', function(Modal, $q, Alert) {
    return {
      require: ['ngModel', '^toggle'],
      link: function ($scope, $element, $attrs, controllers) {
        controllers[0].$parsers.push(function (newValue) {
          var oldValue = $scope.$parent.ngModel;
          
          $scope.$evalAsync(function(){ //For display until confirm dialog value is resolved
            $scope.$parent.ngModel = oldValue;
          });
          
          return $scope.onToggle(newValue, oldValue);
        });

        $scope.onToggle = function(newValue, oldValue){
          return Modal.showConfirm({
            message: (newValue === $scope.trueValue ? $scope.confirmEnableMessage : $scope.confirmDisableMessage)
          }).then(function(){
            $q.when($scope.onConfirm()).then(function(){
              Alert.success('Record updated');
              $scope.$parent.ngModel = newValue;
            }, function(error){
              Alert.error('Record failed to update.' + ' ' + error);
              $scope.$parent.ngModel = oldValue;
            }).finally(function(){
              controllers[0].$setPristine();
              controllers[0].$setUntouched();
            });
            return newValue;
          }, function(){
            return oldValue;
          });
        };
      }
    };
   }]);
