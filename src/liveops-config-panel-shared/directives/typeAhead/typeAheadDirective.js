'use strict';

angular.module('liveopsConfigPanel.shared.directives')
    /** type-ahead element directive
     * Create an input element that shows suggestions as you type
     *
     * Default comparator compares the entered text with the items' getDisplay() result, ignoring case
     */
  .directive('typeAhead', ['$filter', '$parse', function($filter, $parse) {
    return {
      restrict: 'E',
      require: '?^form',
      scope : {
        items: '=', // (array) The items to search for matches
        nameField: '@', // (string) HTML name. Also used as the display property path on the items if given items have no getDisplay function
        onSelect: '&', // (expression) Optional expression invoked when an item is selected. Receives selectedItem as object if text matches one of the items, or the search text if there is no item match
        placeholder: '@', // (string) Optional placeholder text
        prefill: '=', // (string) Optional pre-entered search text. Defaults to ''
        keepExpanded: '=', // (boolean) Whether to keep the dropdown expanded when focus is lost. Defaults to false
        onEnter: '&', // (expression) Optional expression invoked when the enter key is pressed while the element is focused. Receives item as object if an item was selected, or the search text if there is no item match
        filters: '=?', // (expression or array) Optional filter function or list of filters used to determine matching items
        selectedItem: '=?', // (object) Exposes the selectedItem
        disabled: '@' // (boolean) Whether the element is disabled
      },
      templateUrl: 'liveops-config-panel-shared/directives/typeAhead/typeAhead.html',
      controller: function($scope) {
        var self = this;
        $scope.currentText = $scope.prefill || '';

        this.defaultTextFilter = function defaultTextFilter(item, text) {
          var text = text;
          if (_.isEmpty(text)) {
             text = '';
          }

          return item.getDisplay().toLowerCase().contains(text.toLowerCase());
        };

        $scope.filterCriteria = function(item) {
          if (!$scope.filterArray) {
            return;
          }

          var include = true;
          for (var filterIndex = 0; filterIndex < $scope.filterArray.length; filterIndex++) {
            var filter = $scope.filterArray[filterIndex];
            include = include && filter.call(filter, item, $scope.currentText, $scope.items);
          }
          return include;
        };

        $scope.$watch('filters', function(newCriteria) {
          $scope.filterArray = [];

          if (newCriteria && angular.isArray(newCriteria)) {
            $scope.filterArray = angular.copy(newCriteria);
          } else if(newCriteria && !angular.isArray(newCriteria)) {
            $scope.filterArray = [newCriteria];
          }

          $scope.filterArray.push(self.defaultTextFilter);
        }, true);

        $scope.updateHighlight = function(){
          var filteredItems = $filter('filter')($scope.items, $scope.filterCriteria, true);

          if ($scope.currentText === ''){
            $scope.highlightedItem = null;
            $scope.selectedItem = null;
          } else if (filteredItems && filteredItems.length > 0){
            //If previously highlighted item is filtered out, reset the highlight
            var highlightedIndex = filteredItems.indexOf($scope.highlightedItem);
            if (highlightedIndex < 0){
              $scope.highlightedItem = null;
              $scope.selectedItem = $scope.currentText;
            }

            if (angular.isDefined(filteredItems[0].getDisplay) && filteredItems[0].getDisplay() === $scope.currentText){
              //If the input exactly matches a result
              $scope.highlightedItem = filteredItems[0];
              $scope.selectedItem = filteredItems[0];
            } else {
              $scope.highlightedItem = filteredItems[0];
              $scope.selectedItem = $scope.currentText;
            }
          } else {
            $scope.highlightedItem = null;
            $scope.selectedItem = $scope.currentText;
          }
        };

        $scope.$watch('currentText', function() {
          $scope.updateHighlight();
        });

        $scope.$watch('selectedItem', function(newVal) {
          $scope.onSelect({selectedItem: newVal});
          if (newVal === null){
            $scope.currentText = '';
          } else if ($scope.getDisplayString(newVal) !== $scope.currentText){
            //If selectedItem is updated externally, update the search text
            $scope.currentText = $scope.getDisplayString(newVal);
          }
        });

        $scope.$watch('items', function(items) {
          if (angular.isDefined(items)){
            $scope.updateHighlight();
          }
        }, true);

        $scope.select = function(item) {
          $scope.selectedItem = item;

          if (! angular.isString(item)){
            $scope.currentText = $scope.getDisplayString(item);
          }

          if ($scope.form) {
            var ngModel = $parse($scope.nameField)($scope.form);
            ngModel.$setDirty();
            ngModel.$setTouched();
          }

          if (!$scope.keepExpanded) {
            $scope.hovering = false;
            $scope.showSuggestions = false;
          }
        };

        $scope.onBlur = function() {
          if (!$scope.keepExpanded) { //Prevents the button in multibox from jumping around
            $scope.showSuggestions = false;
          }
        };

        $scope.getDisplayString = function(item){
          if (item) {
            if (angular.isFunction(item.getDisplay)){
              return item.getDisplay();
            } else if (angular.isDefined(item[$scope.nameField])){
              return item[$scope.nameField];
            } else {
              return item;
            }
          }
        };
      },
      link: function($scope, element, attr, form) {
        if(form) {
          $scope.form = form;
        }

        element.find('input').bind('keydown keypress', function(event){
          var highlightedIndex;

          if (event.which === 13) { //Enter key
            $scope.$evalAsync(function(){
              var selected = $scope.highlightedItem ? $scope.highlightedItem : $scope.currentText;
              $scope.select(selected);
              $scope.onEnter({item: selected});
            });

            event.preventDefault();
          } else if(event.which === 40){ //Down arrow key
           highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex + 1 < $scope.filtered.length){
              $scope.$evalAsync(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex + 1];

                var li = element.find('li:nth-child(' + (highlightedIndex + 2) + ')');
                $scope.showListElement(li);
              });
            }
          } else if(event.which === 38){ //Up arrow key
            highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex - 1 >= 0){
              $scope.$evalAsync(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex - 1];

                //Scroll to this element in the dropdown
                var li = element.find('li:nth-child(' + highlightedIndex + ')');
                $scope.showListElement(li);
              });
            }
          }
        });

        $scope.showListElement = function(li){
          var elementTop = li.get(0).offsetTop;
          var elementHeight = li.get(0).offsetHeight;
          var elementBottom = elementTop + elementHeight;
          var containerHeight = element.find('ul').get(0).offsetHeight;
          var scrollTop = element.find('ul').get(0).scrollTop;

          if (elementBottom > (scrollTop + containerHeight)){
            element.find('ul').get(0).scrollTop = elementBottom - containerHeight;
          } else if (elementTop < scrollTop){
            element.find('ul').get(0).scrollTop = elementTop;
          }
        };
      }
    };
  }]);
