'use strict';

describe('dateToMinuteConverterController', function () {
  var $scope,
    controller;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.shared.directives'));

  beforeEach(inject(['$rootScope', '$controller',
    function ($rootScope, $controller) {
      $scope = $rootScope.$new();
      
      controller = $controller('dateToMinuteConverterController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON format', function() {
    it('should be defined', function() {
      expect(controller.format).toBeDefined();
    });
    
    it('should return null if value is -1', function() {
      var result = controller.format(-1);
      expect(result).toEqual(null);
    });
    
    it('should return a Date where minutes === value', function() {
      var result = controller.format(30);
      
      expect(result).toEqual(jasmine.any(Date));
      expect(result.getMinutes()).toEqual(30);
    });
    
    it('should return value if value not a number', function() {
      var result = controller.format('string');
      expect(result).toEqual('string');
    });
  });
  
  describe('ON parse', function() {
    it('should be defined', function() {
      expect(controller.parse).toBeDefined();
    });
    
    it('should return -1 if value is null', function() {
      var result = controller.parse(null);
      expect(result).toEqual(-1);
    });
    
    it('should return value if value is not instanceof Date', function() {
      var result = controller.parse('string');
      expect(result).toEqual('string');
    });
    
    it('should return number of minutes equivalent to date.minues + date.hours * 60', function() {
      var newDate = new Date();
      newDate.setMinutes(30);
      newDate.setHours(1);
      
      var result = controller.parse(newDate);
      expect(result).toEqual(90);
    });
  });
});