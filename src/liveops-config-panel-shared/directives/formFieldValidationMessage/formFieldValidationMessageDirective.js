'use strict';

/*
  formFieldValidationMessage is basically a clone of formError with a couple o
  key differences:
    - it "requires" a form up the DOM tree
    - it resolves the field based on fieldName
*/
angular.module('liveopsConfigPanel.shared.directives')
  .directive('formFieldValidationMessage', function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/formFieldValidationMessage/formFieldValidationMessage.html',
      require: '^form',
      scope : {
        fieldName : '@'
      },
      link : function($scope, $elem, $attrs, form){
        $scope.form = form;

        $scope.errorTypes = {};
        angular.forEach($attrs.$attr, function(value, key){
          if(key.match(/errorType+/)){
            var errorName = key.replace(/errorType/, '');
            var firstChar = errorName.charAt(0);
            errorName = errorName.replace(/^\w/, firstChar.toLowerCase());

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
