'use strict';

angular.module('liveopsConfigPanel.shared.filters')
  .filter('selectedTableOptions', ['$parse', '$filter', function ($parse, $filter) {
      return function (items, fields) {
        var filtered = [];

        if (angular.isUndefined(items)) {
          return filtered;
        }

        for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
          var item = items[itemIndex];
          var showItemInTable = true;
          for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            var field = fields[fieldIndex];
            
            //If this filter is currently hidden, skip it
            if (!field.checked) {
              continue;
            }

            if (!$parse('header.options')(field)) {
              continue;
            }
            
            if (field.header.all && field.header.all.checked){
              continue;
            }

            var matchesColumnFilter = true;
            var lookup = field.lookup ? field.lookup : field.name;
            var options = $filter('invoke')(field.header.options);
            var checkedOptions = $filter('filter')(options, {
              checked : true
            }, true);

            //If there aren't any options available, skip this filter
            if (options.length === 0){
              continue;
            }

            if (checkedOptions.length === 0) {
              matchesColumnFilter = false; // Nothing can possibly match
            } else if (checkedOptions.length !== options.length) { // User has chosen a subset of options
              for (var i = 0; i < checkedOptions.length; i++) {
                var option = checkedOptions[i];

                var parseValue = $parse(field.header.valuePath ? field.header.valuePath : 'value');
                var value = $filter('invoke')(parseValue(option), option);

                if ($filter('matchesField')(item, lookup, value)) {
                  matchesColumnFilter = true;
                  break;
                } else {
                  matchesColumnFilter = false;
                }
              }
            }

            showItemInTable = showItemInTable && matchesColumnFilter;
            if (!showItemInTable) {
              break;
            }
          }

          if (showItemInTable) {
            filtered.push(item);
          }
        }

        return filtered;
      };
    }
]);
