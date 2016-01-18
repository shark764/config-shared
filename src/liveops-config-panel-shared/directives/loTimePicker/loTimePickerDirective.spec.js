'use strict';

describe('loTimePicker directive', function(){
  var $scope,
    element,
    doCompile,
    isolateScope;

  beforeEach(module('liveopsConfigPanel.shared.directives'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope',
    function ($compile, _$rootScope_) {
      $scope = _$rootScope_.$new();
      $scope.myModel = -1;

      element = $compile('<lo-time-picker ng-model="myModel"></lo-time-picker>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  describe('updateMinutesValue function', function(){
    it('should return the proper minutes values for morning times', inject(function() {
      isolateScope.selectedHour = {
        minutes: 120,
        label: '2',
        val: 2
      };

      isolateScope.selectedMinute = {
        minutes: 15
      };

      isolateScope.selectedHalf = 'am';

      isolateScope.updateMinutesValue();
      $scope.$digest();
      expect($scope.myModel).toEqual(135);
    }));

    it('should return the proper minutes values for afternoon times', inject(function() {
      isolateScope.selectedHour = {
        minutes: 120,
        label: '2',
        val: 2
      };

      isolateScope.selectedMinute = {
        minutes: 15
      };

      isolateScope.selectedHalf = 'pm';

      isolateScope.updateMinutesValue();
      $scope.$digest();
      expect($scope.myModel).toEqual(855);
    }));

    it('should return 0 for midnight', inject(function() {
      isolateScope.selectedHour = {
        minutes: 720,
        label: '12',
        val: 12
      };

      isolateScope.selectedMinute = {
        minutes: 0
      };

      isolateScope.selectedHalf = 'am';

      isolateScope.updateMinutesValue();
      $scope.$digest();
      expect($scope.myModel).toEqual(0);
    }));

    it('should return 720 for noon', inject(function() {
      isolateScope.selectedHour = {
        minutes: 720,
        label: '12',
        val: 12
      };

      isolateScope.selectedMinute = {
        minutes: 0
      };

      isolateScope.selectedHalf = 'pm';

      isolateScope.updateMinutesValue();
      $scope.$digest();
      expect($scope.myModel).toEqual(720);
    }));

    it('should return -1 if selectedHour is -1', inject(function() {
      isolateScope.selectedHour = {
        minutes: -1,
        label: '--',
        val: -1
      };

      isolateScope.selectedMinute = {
        minutes: 45
      };

      isolateScope.selectedHalf = 'pm';

      isolateScope.updateMinutesValue();
      $scope.$digest();
      expect($scope.myModel).toEqual(-1);
    }));
  });
  
  describe('updateView function', function(){
    it('should set the proper values for a morning time', inject(function() {
      isolateScope.updateView(135);

      expect(isolateScope.selectedHour.val).toEqual(2);
      expect(isolateScope.selectedMinute.val).toEqual(15);
      expect(isolateScope.selectedHalf).toEqual('am');
    }));

    it('should set the proper values for an afternoon time', inject(function() {
      isolateScope.updateView(855);

      expect(isolateScope.selectedHour.val).toEqual(2);
      expect(isolateScope.selectedMinute.val).toEqual(15);
      expect(isolateScope.selectedHalf).toEqual('pm');
    }));

    it('should set the proper values for midnight', inject(function() {
      isolateScope.updateView(0);

      expect(isolateScope.selectedHour.val).toEqual(12);
      expect(isolateScope.selectedMinute.val).toEqual(0);
      expect(isolateScope.selectedHalf).toEqual('am');
    }));

    it('should set the proper values for noon', inject(function() {
      isolateScope.updateView(720);

      expect(isolateScope.selectedHour.val).toEqual(12);
      expect(isolateScope.selectedMinute.val).toEqual(0);
      expect(isolateScope.selectedHalf).toEqual('pm');
    }));

    it('should set the proper values for -1', inject(function() {
      isolateScope.updateView(-1);

      expect(isolateScope.selectedHour.val).toEqual(-1);
      expect(isolateScope.selectedMinute.val).toEqual(0);
      expect(isolateScope.selectedHalf).toEqual('am');
    }));
  });
});
