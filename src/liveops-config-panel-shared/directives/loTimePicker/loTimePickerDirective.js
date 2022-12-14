'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loTimePicker', [function() {
    /** lo-time-picker element directive
     * An element for selecting times (without dates). Sets the given ngModel to the minute value of the selected time.
     *
     * ngModel willl be set to -1 when the user selects a time of "--". Otherwise, the time will be a value between 0 and 1440, inclusive.
     */
    return {
      templateUrl : 'liveops-config-panel-shared/directives/loTimePicker/loTimePicker.html',
      require: 'ngModel',
      scope : {
        ngModel : '=',
        ngTimeSectionPick : '@'
      },
      restrict: 'E',
      link: function($scope){
        $scope.updateModel = function(newValue){
          $scope.ngModel = newValue;
        };

        $scope.init = function(){
          $scope.hours = [{
            minutes: -1,
            val: -1,
            label: '--'
          }];
          $scope.minutes = [];

          for (var i = 1; i < 13; i++){
            $scope.hours.push({
              minutes: 60 * i,
              label: '' + i,
              val: i
            });
          }

          for (var j = 0; j < 4; j++){
            var minutes = 15 * j;
            var label = (minutes < 10) ? '0' : '';

            $scope.minutes.push({
              minutes: minutes,
              label: label + minutes,
              val: j * 15
            });
          }
        };

        $scope.updateMinutesValue = function(){
          var minutesValue = $scope.selectedHour.minutes + $scope.selectedMinute.minutes;
          if ($scope.selectedHalf === 'pm'){
            minutesValue += 720;
          }

          if ($scope.selectedHour.val === 12){
            minutesValue -= 720;
            // Updating minutes from 0 to 1440 when it's endTime
            if ($scope.ngTimeSectionPick === 'EndTimeMinutes'
                && $scope.selectedHalf === 'am'
                && minutesValue === 0){
              minutesValue = 1440;
            }
          }

          if ($scope.selectedHour.val === -1){
            minutesValue = -1;
          }

          $scope.updateModel(minutesValue);
        };

        $scope.updateView = function(modelVal){
          //If -1, it's the default "closed" hours
          if (modelVal === -1){
            $scope.selectedHour = $scope.hours[0];
            $scope.selectedMinute = $scope.minutes[0];
            $scope.selectedHalf = 'am';
            return;
          }

          //Select whether it's morning or afternoon
          //Midnight is 0 as startTime and 1440 as endTime
          if (modelVal >= 720 && modelVal < 1440){
            $scope.selectedHalf = 'pm';
          } else {
            $scope.selectedHalf = 'am';
          }

          //Extract the selected minutes value
          var minutesValue = modelVal % 60;
          var minIndex = minutesValue / 15;
          $scope.selectedMinute = $scope.minutes[minIndex];

          //Extract the selected hour
          var hoursValue = modelVal - (minIndex * 15);
          var hoursIndex = hoursValue / 60;
          if (hoursIndex > 12){
            hoursIndex -= 12;
          }

          if (hoursIndex === 0){
            hoursIndex = 12;
          }

          $scope.selectedHour = $scope.hours[hoursIndex];
        };

        $scope.init();

        $scope.$watch('ngModel', function(newVal){
          $scope.updateView(newVal);
        });
      }
    };
   }]);
