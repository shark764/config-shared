'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('dropdown', [function() {
    /** dropdown element directive
     * Generate a dropdown menu/list of items
     *
     * Supported item config is as follows:
     * - id (string): Optional HTML ID to apply to the item's element
     * - onClick (function): Optional function triggered when the menu item is clicked
     * - stateLink (string): Optional state name to transition to when the menu item is clicked
     * - iconClass (string): Optional class for the icon displayed next to the menu item
     */
    return {
      scope : {
        items : '=', // (array) The list of configs for items to be shown in the menu.
        label : '@', // (string) The text of the menu's label/title
        displayPath: '@', // (string) The item property to be used as the label in the menu. Defaults to 'label'
        collapseIcon: '@', // (string) The class(es) applied to the icon shown when the menu is open. Defaults to 'fa fa-caret-up'
        expandIcon: '@', // (string) The class(es) applied to the icon shown when the menu is closed. Defaults to 'fa fa-caret-down'
        orderBy: '@', // (string) The item property to be used to sort the menu items. Defaults to 'label'
        groupBy: '@', // (string) The item property to be used to group the menu items. Defaults to no grouping.
        hovering: '=?', // (boolean) Optional var to expose if the dropdown menu is being moused-over
        hoverTracker: '=?', // (array) Optional array used to track which dropdowns on the view are open
        showOnHover: '=?' // (boolean) Optional var to define if the menu should be shown when the label is hovered-over. Defaults to false
      },
      restrict: 'E',
      templateUrl : 'liveops-config-panel-shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element, attrs, controller) {
        scope.displayPath = scope.displayPath ? scope.displayPath : 'label';
        scope.collapseIcon = scope.collapseIcon ? scope.collapseIcon : 'fa fa-caret-up';
        scope.expandIcon = scope.expandIcon ? scope.expandIcon : 'fa fa-caret-down';
        scope.orderBy = scope.orderBy ? scope.orderBy : 'label';

        if (angular.isDefined(scope.hovering) && scope.hoverTracker){
          scope.hoverTracker.push(controller);
        }

        scope.clearOtherHovers = function(){
          angular.forEach(scope.hoverTracker, function(hoverCtrl){
            if (hoverCtrl !== controller){
              hoverCtrl.setShowDrop(false);
            }
          });
        };

        scope.optionClick = function(func){
          scope.showDrop = false;
          scope.hovering = false;

          if (angular.isFunction(func)){
            func();
          }
        };

        scope.mouseIn = function(){
          if (scope.hovering || scope.showOnHover){
            document.activeElement.blur(); // needed to remove focus from iframe on historical dashboards
            scope.showDrop = true;
            scope.clearOtherHovers();
          }
        };

        scope.dropClick = function(){
          scope.showDrop = ! scope.showDrop;
          scope.hovering = ! scope.hovering;
        };

        scope.dropdownIconClass = function() {
          return scope.showDrop ? scope.expandIcon : scope.collapseIcon;
        };
      }
    };
   }])
;
