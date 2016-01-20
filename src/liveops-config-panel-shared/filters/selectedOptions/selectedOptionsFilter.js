'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('selectedOptions', ['$filter', function ($filter) {
    /** selectedOptions filter
     * Accepts an array of items and a field configuration object
     * Returns a list of items whose field property matches at least one of the 'checked' options value
     *
     * Field configuration object supports the following properties
     * - name (string) The path of the property to match. Passed to matchesField filter
     * - options (array of objects)
     *     - value (any) The value to match against
     *     - checked (boolean) Whether this field value is selected and should be matched against
     */
    return function (items, field) {
      var filtered = [];
      var options = $filter('invoke')(field.options);
      angular.forEach(items, function (item) {
        var wasAdded = false;
        angular.forEach(options, function (option) {
          var value = $filter('invoke')(option.value, option);
          if (!wasAdded && option.checked &&
            $filter('matchesField')(item, field.name, value)) {

            filtered.push(item);
            wasAdded = true;
          }
        });
      });

      return filtered;
    };
  }]);
