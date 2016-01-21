'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('matchesField', ['$filter', function ($filter) {
    /** matchesField filter
     * Accepts an objectg, a string representing the property path, and the value to match
     * If the item's property matches the value, returns the item
     * If no match, returns undefined.
     * 
     * Allows matching/search through arrays; use colons in fieldPath to separate layers
     * e.g. "skills:id" will search an object like {name: "name", skills: [{id: "id"}, {id: "other"}]}
     */
    return function (item, fieldPath, value) {
      var findFields = function (item, fieldPath, value) {
        if (angular.isUndefined(item) || angular.isUndefined(fieldPath) || fieldPath === '' || angular.isUndefined(value)){
          return;
        }

        var firstColonIndex = fieldPath.indexOf(':');
        //If there are colons still in the field path, we recurse with the next level
        if (firstColonIndex > -1){
          var currentPath = fieldPath.substring(0, firstColonIndex);
          var remainingPath = fieldPath.substring(firstColonIndex + 1);
          
          return findFields(item[currentPath], remainingPath, value) ? item : undefined;
        }

        //The field path has no more colons in it, and our item is an array, check the array item properties
        if (angular.isArray(item)) {
          for (var i = 0; i < item.length; i++){
            if (item[i][fieldPath] === value){
              return item;
            }
          }
        } else { //Otherwise, check the item properties
          if ($filter('parse')(item, fieldPath) === value) {
            return item;
          }
        }
      };

      return findFields(item, fieldPath, value);
    };
  }]);