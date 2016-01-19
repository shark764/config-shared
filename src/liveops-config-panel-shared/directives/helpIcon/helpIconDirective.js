'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    /** help-icon element directive
     * Generate a icon that shows a tooltip when hovered
     */
    return {
      templateUrl : 'liveops-config-panel-shared/directives/helpIcon/helpIcon.html',
      restrict: 'E',
      scope : {
        text : '@', // (string) Optional text for the tooltip content
        translateValue: '@' // (string) Optional translation key for the tooltip content
      },
      link: function($scope, element){
        $scope.target = element;
        var tooltipElement;

        $scope.showTooltip = function(){
          tooltipElement = $compile('<tooltip target="target" text="{{text}}" translate-value="{{translateValue}}"></tooltip>')($scope);
          $document.find('body').append(tooltipElement);
        };

        $scope.destroyTooltip = function(){
          tooltipElement.remove();
        };
      }
    };
   }]);