'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('numberSlider', [function(){
    /** number-slider element directive
     * A number-spinner element for choosing a number
     */
    return {
      restrict: 'E',
      scope: {
        value: '=', // (int) The selected number
        minValue: '@', // (int) Optional minimum number that the user can select (inclusive)
        maxValue: '@', // (int) Optional maximum number that the user can select (inclusive)
        hasHandles: '=', // (boolean) Whether to show the increment and decrement buttons
        placeholder: '@', // (string) Optional placeholder text
        onChange: '&' // (expression) Optional expression to be executed when the value changes
      },
      templateUrl: 'liveops-config-panel-shared/directives/numberSlider/numberSlider.html',
      link: function($scope, element) {
        $scope.minValue = $scope.minValue ? Number($scope.minValue) : null;
        $scope.maxValue = $scope.maxValue ? Number($scope.maxValue) : null;

        $scope.$watch('value', function () {
          if($scope.value){
            if(typeof($scope.value) === 'string'){
              $scope.value = Number($scope.value.replace(/[^0-9\\.\\-]/g, ''));
            }

            if ($scope.maxValue !== null && $scope.value > $scope.maxValue) {
              $scope.value = $scope.maxValue;
            }

            if ($scope.minValue !== null && $scope.value < $scope.minValue) {
              $scope.value = $scope.minValue;
            }

            $scope.onChange($scope.value);
          }
        });

        $scope.increment = function () {
          if(angular.isUndefined($scope.value) || $scope.value === null){
            //If the element was only showing the placeholder, set the value
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.onChange();
            return;
          }

          if($scope.maxValue === null || $scope.value < $scope.maxValue){
            $scope.value = Number($scope.value) + 1;
            $scope.onChange();
          }
        };

        $scope.decrement = function () {
          if(angular.isUndefined($scope.value) || $scope.value === null){
           //If the element was only showing the placeholder, set the value
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.onChange();
            return;
          }

          if($scope.minValue === null || $scope.value > $scope.minValue){
            $scope.value = Number($scope.value) - 1;
            $scope.onChange();
          }
        };

        element.find('input').bind('keydown keypress', function(event){
          if(event.which === 40){ //Down arrow key
            $scope.$evalAsync($scope.decrement);
            event.preventDefault();
          } else if(event.which === 38){ //Up arrow key
            $scope.$evalAsync($scope.increment);
            event.preventDefault();
          }
        });
      }
    };
  }]);
