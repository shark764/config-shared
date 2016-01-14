'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loFormSubmit', ['$parse', 'apiErrorKeys',
    function($parse, apiErrorKeys) {
      return {
        restrict: 'A',
        require: 'form',
        controller: function($scope) {
          var self = this;
          
          self.errorInputWatchesUnbinds = {};
          
          this.populateApiErrors = function(error) {
            if ($parse('data.error')(error)) {
              angular.forEach(error.data.error.attribute, function(value, key) {
                if (angular.isDefined(self.formController[key])){
                  
                  //if api error is a hardcoded key like "required", then simply
                  //set the form field error key to {value: true}
                  if(apiErrorKeys.indexOf(value) >= 0) {
                    self.formController[key].$setValidity(value, false);
                    self.formController[key].$error = {};
                    self.formController[key].$error[value] = true;
                  } else {
                    self.formController[key].$setValidity('api', false);
                    self.formController[key].$error = {
                      api: value
                    };
                  }
                  
                  
                  self.formController[key].$setTouched();
                  self.formController[key].$setPristine();
                  
                  self.errorInputWatchesUnbinds[key] = $scope.$watch(function(){
                    return self.formController[key].$dirty;
                  }, function(dirtyValue){
                    if (dirtyValue){
                      self.formController[key].$setValidity('api', true);
                      self.errorInputWatchesUnbinds[key]();
                      delete self.errorInputWatchesUnbinds[key];
                    }
                  });
                }
              });
            }

            return error;
          };
        },
        link: function($scope, $elem, $attrs, form) {
          var controller = $elem.data('$loFormSubmitController');
          controller.formController = form;
          form.loFormSubmitController = controller;
        }
      };
    }
  ]);
