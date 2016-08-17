'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .controller('DropdownController', ['$scope', '$document', '$element', function ($scope, $document, $element) {
    var self= this;
    $scope.showDrop = false;
    this.setShowDrop = function(val){ //Used by the dropdownDirective
      $scope.showDrop = val;
    };

    //Only bother listening for the click event when a dropdown is open
    $scope.$watch('showDrop',
      function (newValue, oldValue) {
        $document.off('mouseout', self.onClick);

        if (newValue && !oldValue) {
          $document.on('mouseout', self.onClick);
        }
    });

    // If window loses focus (ie, user clicks on Birst iframe), close dropdown
    window.addEventListener('blur', function() {
      $scope.$apply(function() {
        $scope.showDrop = false;
        $scope.hovering = false;
      });

      $document.off('click', self.onClick);
    });

    this.onClick = function(event) {
      //Hide the dropdown when user clicks outside of it
      var clickedInDropdown = $element.find(event.target).length > 0;
      if (clickedInDropdown) {
        return;
      }

      $scope.$apply(function () {
        $scope.showDrop = false;
        $scope.hovering = false;
      });

      $document.off('click', self.onClick);
    };
  }]);
