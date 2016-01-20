'use strict';

/**
  Taken from a stackoverflow.com post reply

  http://stackoverflow.com/a/25822878
**/

angular.module('liveopsConfigPanel.shared.directives')
  .directive('disableContents', [function() {
    /** disable-contents attribute directive
     * Set ng-disabled on certain child elements to equal the given expression
     * Child elements affected are input, button, select, textarea, and label
     * If a child element already has ng-disabled defined, the given expression is OR'd with the existing ng-disabled value
     */
    return {
      compile: function(tElem, tAttrs) {
        var inputNames = 'input, button, select, textarea, label';

        var inputs = tElem.find(inputNames);
        angular.forEach(inputs, function(el){
          el = angular.element(el);
          var prevVal = el.attr('ng-disabled');
          prevVal = prevVal ? prevVal +  ' || ': '';
          prevVal += tAttrs.disableContents;
          el.attr('ng-disabled', prevVal);
        });
      }
    };
  }]);
