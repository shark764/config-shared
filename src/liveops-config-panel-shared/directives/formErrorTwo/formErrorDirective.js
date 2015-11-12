'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('formErrorTwo', function() {
    return {
      templateUrl : 'liveops-config-panel-shared/directives/formError/formError.html',
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
