'use strict';

angular.module('liveopsConfigPanel.shared.filters')
.filter('objectNegation', function() {
    /** objectNegation filter
     * Accepts two sets of arrays and field names
     * Returns all items from the first array that do not have a 'field' property matching the 'otherField' values from the second array
     */
    return function (items, field, otherItems, otherField) {
      var filtered = [];

      angular.forEach(items, function(item){
        var include = true;

        for(var i = 0; i < otherItems.length; i++){
          var otherItem = otherItems[i];

          if(item[field] === otherItem[otherField]){
            include = false;
            break;
          }
        }

        if(include){
          filtered.push(item);
        }
      });

      return filtered;
    };
  });