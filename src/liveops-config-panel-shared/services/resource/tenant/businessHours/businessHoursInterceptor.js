'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('businessHourTransformer', ['BusinessHourException', function(BusinessHourException) {
    this.transform = function(businessHour) {
      businessHour.$exceptions = [];
      for(var index = 0; index < businessHour.exceptions.length; index++) {
        var exception = new BusinessHourException(businessHour.exceptions[index]);
        businessHour.$exceptions.push(exception);
        delete businessHour.exceptions[index];
      }
    };
  }])
  .service('businessHourInterceptor', ['businessHourTransformer',
    function(businessHourTransformer) {
      this.response = function(response) {
        var businessHour = response.resource;

        businessHourTransformer.transform(businessHour);

        return businessHour;
      };
    }
  ])
  .service('businessHourQueryInterceptor', ['businessHourTransformer',
    function(businessHourTransformer) {
      this.response = function(response) {
        angular.forEach(response.resource, function(businessHour) {
          businessHourTransformer.transform(businessHour);
        });

        return response.resource;
      };
    }
  ]);
