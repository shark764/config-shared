'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('formError', function() {
    /** form-error element directive
     * Display error messages for an invalid ng-form field
     * 
     * Define error messages by passing the translation key as an attribute like "error-type-[VALIDATION_KEY]"
     * E.g. set the message for a "required" validation error: error-type-required="my.required.key" 
     *      set the message for an "email" validation error: error-type-email="some.email.error.message"
     */
    return {
      restrict: 'E',
      templateUrl : 'liveops-config-panel-shared/directives/formError/formError.html',
      scope : {
        field : '=' // (object) The ng-form field object to show error messages for
      },
      link : function($scope, $elem, $attrs){
        $scope.errorTypes = {};
        angular.forEach($attrs.$attr, function(value, key){
          if(key.match(/errorType+/)){
            var errorName = key.replace(/errorType/, '');
            var firstChar = errorName.charAt(0);
            errorName = errorName.replace(/^\w/, firstChar.toLowerCase());
            $scope.errorTypes[errorName] = $attrs[key];
            
            $attrs.$observe(key, function(attrValue){
              $scope.errorTypes[errorName] = attrValue;
            });
          }
        });
        
        $scope.isString = function(value) {
          return angular.isString(value);
        };
      }
    };
   });
