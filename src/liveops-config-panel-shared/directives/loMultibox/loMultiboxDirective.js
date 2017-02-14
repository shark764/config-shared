'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loMultibox', [function(){
    /** lo-multibox element directive
     * A custom select-like element for liveopsResources, that also allows the user to create a new item
     *
     * Listen for ('resource:details:create:' + resourceName) to handle the create. The event passes selectedItem, and initialized createMode
     * Broadcast ('resource:details:' + resourceName + ':canceled') to tell the multibox that create has been canceled, and cancel createMode
     * Broadcast ('created:resource:' + resourceName) when loMultibox is in createMode to select the given resource
     */
    return {
      restrict: 'E',
      scope: {
        items: '=', // (array) The items used to populate the dropdown. Expected to be liveopsResources
        selectedItem: '=', // (object) The currently selected item. Will be null if nothing is selected
        resourceName: '@', // (string) The name of the liveopsResource used for this dropdown. Used when broadcasting events
        name: '@', // (string) The html name attribute for the element
        onItemSelect: '=', // (function) Optional function to execute when an item is selected
        idx: '=',
        bypassMultipicker: '=', // (boolean) Setting this to true allows the individual multipicker
        // to exist in the same view without being unintentionally data-bound to another multipicker
        hideNewButton: '=',
        filters: '=?' // Optional filter function or list of filters to pass to the type-ahead
      },
      templateUrl: 'liveops-config-panel-shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {
        if ($scope.bypassMultipicker === true) {
            return;
        }

        $scope.onSelect = function(selectedItem){
          if ($scope.bypassMultipicker === true) {
            return;
          }

          if (angular.isString(selectedItem)) {
            return; //User has typed a value into the typeahead that does not match an item. Ignore it.
          }

          try {
            $scope.display = selectedItem || _.isEmpty(selectedItem) ||  angular.isDefined(selectedItem) ? selectedItem.getDisplay() : null;
          } catch (err) {}

          if(angular.isFunction($scope.onItemSelect)) {
            $scope.onItemSelect(selectedItem, $scope.idx);
          }

          dropCtrl.setShowDrop(false);
          $scope.createMode = false;
        };

        $scope.createItem = function(){
          $scope.$emit('resource:details:create:' + $scope.resourceName, $scope.selectedItem);
          $scope.createMode = true;
        };

        $scope.labelClick = function(){
          $scope.$emit('multipickerClicked', {
            clickData: {
              selectedItem: $scope.selectedItem
            }
          });

          dropCtrl.setShowDrop(!$scope.showDrop);
          $scope.selectedItem = null;

          if ($scope.showDrop){
            $scope.$evalAsync(function(){
              var input = ele.find('type-ahead input');
              input.focus();
            });
          }
        };

        $scope.$watch('selectedItem', function(item) {
          if (angular.isString(item)){ //User has typed a value into the typeahead that does not match an item. Ignore it.
            return;
          } else if(item && angular.isFunction(item.getDisplay)) {
            $scope.display = item.getDisplay();
          }
        }, true);

        $scope.$on('resource:details:' + $scope.resourceName + ':canceled', function () {
          $scope.createMode = false;
        });

        $scope.$on('created:resource:' + $scope.resourceName,
          function (event, resource) {
            if ($scope.createMode){
              $scope.onSelect(resource);
            }
        });
      }
    };
  }]);
