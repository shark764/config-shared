'use strict';

describe('separateValidation directive', function(){
  var $scope,
    $compile,
    element,
    controller,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    
    //Reset between tests
    controller = null;
    element = null;
    
    doDefaultCompile = function(){
      element = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form" separate-validation><input name="innerInput" ng-required="true" ng-model="innerInput"></input></ng-form></ng-form>')($scope);
      controller = angular.element(element.find('ng-form')[0]).controller('form');
    };
  }]));
  
  it('should remove the subform from the parent controller', function() {
    var normalElement = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form"><input name="inner-input"></input></ng-form></ng-form>')($scope);
    var normalController = normalElement.controller('form');
    expect(normalController['inner-form']).toBeDefined();
    
    element = $compile('<ng-form name="first-form"><input name="input-one"></input><ng-form name="inner-form" separate-validation><input name="inner-input"></input></ng-form></ng-form>')($scope);
    var separatedController = element.controller('form');
    expect(separatedController['inner-form']).not.toBeDefined();
  });
  
  describe('setValidity function', function(){
    it('should set invalid if field is required and not supplied', function() {
      doDefaultCompile();
      $scope.$digest();
      controller.$setValidity();
      expect(controller.$invalid).toBeTruthy();
    });
    
    it('should set invalid to false if field is required and supplied', function() {
      doDefaultCompile();
      $scope.$digest();
      controller.innerInput.$error = {required : false};
      controller.$setValidity();
      expect(controller.$invalid).toBeFalsy();
    });
  });
  
  describe('setDirty function', function(){
    it('should set the dirty flag to true', function() {
      doDefaultCompile();
      expect(controller.$dirty).toBeFalsy();
      controller.$setDirty();
      expect(controller.$dirty).toBeTruthy();
    });
  });
  
  describe('setPristine function', function(){
    it('should set the pristine', function() {
      doDefaultCompile();
      expect(controller.$pristine).toBeTruthy();
      controller.$setPristine(false);
      expect(controller.$pristine).toBeFalsy();
      controller.$setPristine(true);
      expect(controller.$pristine).toBeTruthy();
    });
  });
});