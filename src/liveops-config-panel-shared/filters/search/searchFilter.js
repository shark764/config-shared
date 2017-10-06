'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('search', ['$parse', function ($parse) {
    /** search filter
     * Accepts an array of items, an array of fields to check for matches, and a string search text
     * Returns a list of items that have at least one property from the list of fields that contain the search text
     * Returns the original list of items if fields or query are falsy
     *
     * Matches ignore special characters and are case-insensitive
     */
    return function (items, fields, query) {
      if (!fields || !query) {
        return items;
      }

      function regExpReplace(string) {
        return string
          .replace(/[\-\[\]\/\{\}\(\)\+\?\.\=\:\!\\\^\$\|]/g, '\\$&')
          .replace(/([*])/g, '.*');
      }

      var findFields = function (field, item) {
        var itemStrings = [];
        var fieldGetter = $parse(field.path);
        var fieldValue = fieldGetter(item);

        if (typeof (fieldValue) === 'string') {
          itemStrings = [fieldValue];
        } else if (typeof (fieldValue) === 'object') {
          angular.forEach(fieldGetter(item), function (result) {
            if ('inner' in field) {
              itemStrings = itemStrings.concat(findFields(field.inner, result));
            } else {
              itemStrings = [result];
            }
          });
        }
        return itemStrings;
      };

      var filtered = [];
      angular.forEach(items, function (item) {

        var wildCardQuery = new RegExp(regExpReplace(query), 'i');
        var itemString = '';

        angular.forEach(fields, function (field) {
          if (typeof (field) === 'string') {
            itemString += $parse(field)(item) + ' ';
          } else if (typeof (field) === 'object') {
            itemString += findFields(field, item).join(' ') + ' ';
          }
        });

        if (wildCardQuery.test(itemString)) {
          filtered.push(item);
        }
      });

      return filtered;
    };
  }]);
