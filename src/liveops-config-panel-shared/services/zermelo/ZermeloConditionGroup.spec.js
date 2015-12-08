(function () {
  'use strict';

  describe('ZermeloConditionGroup', function () {
    var jsedn,
        ZermeloCondition,
        ZermeloConditionGroup;


    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.config'));

    beforeEach(inject(function (_jsedn_, _ZermeloConditionGroup_, _ZermeloCondition_) {
      jsedn = _jsedn_;
      ZermeloConditionGroup = _ZermeloConditionGroup_;
      ZermeloCondition = _ZermeloCondition_;
    }));

    describe('getConditionIdentifiers', function () {
      it('should return a list of all conditions identifiers', function () {
        var zcg = new ZermeloConditionGroup('and'),
            zc1 = new ZermeloCondition('uuid', '1'),
            zc2 = new ZermeloCondition('uuid', '2');

        zcg.addCondition(zc1);
        zcg.addCondition(zc2);

        expect(zcg.getConditionIdentifiers()).toEqual(['1', '2']);
      });
    });

    describe('removeCondition', function () {
      it('should remove the specified condition if it exists', function () {
        var zcg = new ZermeloConditionGroup('and'),
            zc1 = new ZermeloCondition('uuid', '1'),
            zc2 = new ZermeloCondition('uuid', '2');

        zcg.addCondition(zc1);
        zcg.addCondition(zc2);

        expect(zcg.conditions).toEqual([zc1, zc2]);

        zcg.removeCondition(zc1);

        expect(zcg.conditions).toEqual([zc2]);
      });

      it('should have no effect if the condition does not exist', function () {
        var zcg = new ZermeloConditionGroup('and'),
            zc1 = new ZermeloCondition('uuid', '1'),
            zc2 = new ZermeloCondition('uuid', '2'),
            zc3 = new ZermeloCondition('uuid', '3');

        zcg.addCondition(zc1);
        zcg.addCondition(zc2);

        expect(zcg.conditions).toEqual([zc1, zc2]);

        zcg.removeCondition(zc3);

        expect(zcg.conditions).toEqual([zc1, zc2]);
      });
    });

    describe('addCondition', function () {
      it('should add the condition to the list in the order of insertion', function () {
        var zcg = new ZermeloConditionGroup('and'),
            zc1 = new ZermeloCondition('uuid', '1'),
            zc2 = new ZermeloCondition('uuid', '2'),
            zc3 = new ZermeloCondition('uuid', '3');

        zcg.addCondition(zc1);
        expect(zcg.conditions).toEqual([zc1]);

        zcg.addCondition(zc2);
        expect(zcg.conditions).toEqual([zc1, zc2]);
      });
    });

    describe('fromEdn', function () {
      it('should deserialize a list of maps preceeded by a symbol', function () {
        var edn = '(foo {#uuid "1" true} {#uuid "2" true})';

        var cg = ZermeloConditionGroup.fromEdn(jsedn.parse(edn));
        expect(cg.conditions.length).toBe(2);
        expect(cg.conditions[0].identifier).toEqual('1');
        expect(cg.conditions[1].identifier).toEqual('2');
        expect(cg.operator).toEqual('foo');
      });

      it('should throw a \'condition group must be a list\' exception if edn is not a list', function () {
        var edn = '[other {#uuid "1" true}]';
        expect(function () { ZermeloConditionGroup.fromEdn(jsedn.parse(edn)) }).toThrow('condition group must be a list');
      });

      it('should throw the exception thrown by ZermeloCondition', function () {
        var edn = '(other [#uuid "1" true])';
        expect(function () { ZermeloConditionGroup.fromEdn(jsedn.parse(edn)) }).toThrow('condition must be a map');
      });
    });

    describe('toEdn', function () {
      it('should serialize the condition group into an edn list of maps', function () {
        var zcg = new ZermeloConditionGroup('foo'),
            zc1 = new ZermeloCondition('uuid', '1'),
            zc2 = new ZermeloCondition('uuid', '2');

        zcg.addCondition(zc1);
        zcg.addCondition(zc2);

        var list = zcg.toEdn(),
            operator = list.val[0],
            cond1 = list.val[1],
            cond2 = list.val[2];

        expect(list).toEqual(jasmine.any(jsedn.List));
        expect(list.val.length).toEqual(3);
        expect(operator).toEqual(jasmine.any(jsedn.Symbol));
        expect(operator.val).toEqual('foo');
        expect(cond1 instanceof jsedn.Map).toBeTruthy();
        expect(cond2 instanceof jsedn.Map).toBeTruthy();
      });

      it('should return null if allowEmpty is false and there are no items', function () {
        var zcg = new ZermeloConditionGroup('foo');

        var list = zcg.toEdn();

        expect(list).toBeNull();
      });

      it('should return an empty list if allowEmpty is true and there are no items', function () {
        var zcg = new ZermeloConditionGroup('foo');

        var list = zcg.toEdn(true),
            operator = list.val[0];

        expect(list).toEqual(jasmine.any(jsedn.List));
        expect(list.val.length).toEqual(1);
        expect(operator.val).toEqual('foo');
      });
    });

  });

})();
