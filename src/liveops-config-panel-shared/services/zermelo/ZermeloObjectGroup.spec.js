(function () {
  'use strict';

  xdescribe('ZermeloObjectGroup', function () {
    var jsedn,
        ZermeloCondition,
        ZermeloObjectGroup,
        ZermeloConditionGroup;


    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.config'));

    beforeEach(inject(function (_jsedn_, _ZermeloObjectGroup_, _ZermeloConditionGroup_, _ZermeloCondition_) {
      jsedn = _jsedn_;
      ZermeloConditionGroup = _ZermeloConditionGroup_;
      ZermeloObjectGroup = _ZermeloObjectGroup_;
      ZermeloCondition = _ZermeloCondition_;
    }));


    describe('hasConditions', function () {
      it('should return true if either the \'and\' or \'or\' list contains at least one value', function () {
        var zog = new ZermeloObjectGroup();
        zog.orConditions.addCondition(new ZermeloCondition('uuid', '123'));
        expect(zog.hasConditions).toBeTruthy();

        zog.orConditions = new ZermeloConditionGroup('or');
        zog.andConditions.addCondition(new ZermeloCondition('uuid', '123'));
        expect(zog.hasConditions()).toBeTruthy();

        zog.andConditions = new ZermeloConditionGroup('and');
        zog.orConditions.addCondition(new ZermeloCondition('uuid', '123'));
        zog.andConditions.addCondition(new ZermeloCondition('uuid', '123'));
        expect(zog.hasConditions()).toBeTruthy();
      });

      it('should return false if both the \'and\' or \'or\' list contains no values', function () {
        var zog = new ZermeloObjectGroup();
        expect(zog.hasConditions()).toBeFalsy();
      });
    });

    describe('fromEdn', function () {
      it('should convert an edn list and put the conditions in the appropriate lists', function () {
        var edn = jsedn.parse('( and \
          ( and  \
            {#uuid "1" true} \
            {#uuid "3" true} \
          ) \
          ( or \
            {#uuid "2" (>= 10)}\
          ) \
        )');

        var zog = ZermeloObjectGroup.fromEdn(edn);
        expect(zog.andConditions.conditions.length).toEqual(2);
        expect(zog.orConditions.conditions.length).toEqual(1);
      });

      it('should convert an edn list even if only one set of items is provided', function () {
        var edn = jsedn.parse('( and \
          ( and  \
            {#uuid "1" true} \
            {#uuid "3" true} \
          ) \
        )');

        var zog = ZermeloObjectGroup.fromEdn(edn);
        expect(zog.andConditions.conditions.length).toEqual(2);
        expect(zog.orConditions.conditions.length).toEqual(0);
      });

      it('should convert an edn list even if one set of items is empty', function () {
        var edn = jsedn.parse('( and \
          ( and  \
            {#uuid "1" true} \
            {#uuid "3" true} \
          ) \
          ( or ) \
        )');

        var zog = ZermeloObjectGroup.fromEdn(edn);
        expect(zog.andConditions.conditions.length).toEqual(2);
        expect(zog.orConditions.conditions.length).toEqual(0);
      });

      it('should throw an \'object group must be a list\' error if it is not a list', function () {
        expect(function () { ZermeloObjectGroup.fromEdn(jsedn.parse('{}')) }).toThrow('object group must be a list');
      });

      it('should throw an \'condition group must start with \'and\' or \'or\'\' error if the object groups do not start with \'and\' or \'or\'', function () {
        var edn = jsedn.parse('( and \
          ( foo ) \
          ( and ) \
          ( or ) \
        )');
        expect(function () { ZermeloObjectGroup.fromEdn(edn) }).toThrow('condition group must start with \'and\' or \'or\' but found foo');
      });

      it('should throw an \'object group must start with and\' error if the object groups do not start with \'and\'', function () {
        var edn = jsedn.parse('( \
          ( and ) \
          ( or ) \
        )');

        expect(function () { ZermeloObjectGroup.fromEdn(edn) }).toThrow('object group must start with and');
      });
    });

    describe('toEdn', function () {

    });

  });

})();
