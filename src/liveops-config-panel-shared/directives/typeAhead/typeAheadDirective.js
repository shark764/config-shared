'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('typeAhead', ['$filter', '$timeout', function($filter, $timeout) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        nameField: '@',
        onSelect: '&',
        placeholder: '@',
        prefill: '=',
        keepExpanded: '=',
        onEnter: '&',
        filters: '=?',
        selectedItem: '=?'
      },

      templateUrl: 'liveops-config-panel-shared/directives/typeAhead/typeAhead.html',

      controller: function($scope) {
        var self = this;

        $scope.currentText = $scope.prefill || '';

        this.defaultTextFilter = function defaultTextFilter(item, text) {
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
          if (newVal === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('items', function(items) {
          if (angular.isDefined(items)){
            $scope.updateHighlight();
          }
        }, true);

        $scope.select = function(item) {
          if (! angular.isString(item)){
            $scope.currentText = angular.isDefined(item.getDisplay) ? item.getDisplay() : item[$scope.nameField];
          }

          $scope.selectedItem = item;
          $scope.onSelect({selectedItem: item});

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

        $scope.orderByFunction = function(item){
          var displayString = item.getDisplay();

          return displayString? displayString : item[$scope.nameField];
        };
      },
      link: function($scope, element) {
        element.find('input').bind('keydown keypress', function(event){
          var highlightedIndex;

          if (event.which === 13) { //Enter key
            $timeout(function(){
              var selected = $scope.highlightedItem ? $scope.highlightedItem : $scope.currentText;
              $scope.select(selected);
              $scope.onEnter({item: selected});
            });

            event.preventDefault();
          } else if(event.which === 40){ //Down arrow key
           highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex + 1 < $scope.filtered.length){
              $timeout(function(){
                $scope.highlightedItem = $scope.filtered[highlightedIndex + 1];

                var li = element.find('li:nth-child(' + (highlightedIndex + 2) + ')');
                $scope.showListElement(li);
              });
            }
          } else if(event.which === 38){ //Up arrow key
            highlightedIndex = $scope.filtered.indexOf($scope.highlightedItem);

            if (highlightedIndex - 1 >= 0){
              $timeout(function(){
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