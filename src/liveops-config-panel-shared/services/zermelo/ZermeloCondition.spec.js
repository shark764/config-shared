(function () {
  'use strict';

  describe('ZermeloCondition', function () {
    var jsedn,
        ZermeloCondition;


    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.config'));

    beforeEach(inject(function (_jsedn_, _ZermeloCondition_) {
      jsedn = _jsedn_;
      ZermeloCondition = _ZermeloCondition_;
    }));

    describe('setFilter', function () {
      it('should set the filter to the first argument if only one argument is passed', function () {
        var cond = new ZermeloCondition('uuid', '123');
        cond.setFilter(true);
        expect(cond.filter).toEqual(true);
      });

      it('should set the filter to an array if two arguments are passed in', function () {
        var cond = new ZermeloCondition('uuid', '123');
        cond.setFilter('>=', 10);
        expect(cond.filter).toEqual(['>=', 10]);
      });
    });

    describe('fromEdn', function () {
      it('should properly deserialize \'simple\' filters', function() {
        var edn = '{#uuid "abc-123" true}';

        var cond = ZermeloCondition.fromEdn(jsedn.parse(edn));
        expect(cond.tag).toEqual('uuid');
        expect(cond.identifier).toEqual('abc-123');
        expect(cond.filter).toEqual(true);
      });

      it('should properly deserialize \'complex\' filters', function (){
        var edn = '{#uuid "abc-123" (>= 10)}';

        var cond = ZermeloCondition.fromEdn(jsedn.parse(edn));
        expect(cond.tag).toEqual('uuid');
        expect(cond.identifier).toEqual('abc-123');
        expect(cond.filter).toEqual(['>=', 10]);
      });

      it('should throw a \'condition must be a map\' error when condition is not a map', function (){
        var edn = '[i am a list]';
        expect(function () { ZermeloCondition.fromEdn(jsedn.parse(edn)) }).toThrow('condition must be a map');
      });

      it('should throw a \'condition must start with #uuid\' error when it does not start with #uuid', function (){
        var edn = '{#abc/uuid "abc-123" (>= 10)}';
        expect(function () { ZermeloCondition.fromEdn(jsedn.parse(edn)) }).toThrow('condition must start with #uuid');
      });

      it('should throw a \'condition filter must be exactly length 2 if it is a list\' when filter list length is > 2', function (){
        var edn = '{#uuid "abc-123" (>= 10 abc)}';
        expect(function () { ZermeloCondition.fromEdn(jsedn.parse(edn)) }).toThrow('condition filter must be exactly length 2 if it is a list');
      });

      it('should throw a \'if condition filter is not a list, it must be true\' when filter is not a list, and not true', function (){
        var edn = '{#uuid "abc-123" false}';
        expect(function () { ZermeloCondition.fromEdn(jsedn.parse(edn)) }).toThrow('if condition filter is not a list, it must be true');
      });

    });

    describe('toEdn', function () {

      it('should properly convert condition with null filters', function () {
        var cond = new ZermeloCondition('uuid', 'abc-123');

        var jsEdn = cond.toEdn(),
            tagMap = jsEdn.keys[0],
            filter = jsEdn.vals[0];

        expect(jsEdn).toEqual(jasmine.any(jsedn.Map));
        expect(tagMap).toEqual(jasmine.any(jsedn.Tagged));
        expect(tagMap.obj()).toEqual('abc-123');
        expect(tagMap.tag().namespace).toEqual('uuid');
        expect(filter).toEqual(null);
      });

      it('should properly convert conditions with \'simple\' filters', function () {
        var cond = new ZermeloCondition('uuid', 'abc-123');
        cond.setFilter(true);

        var jsEdn = cond.toEdn(),
            tagMap = jsEdn.keys[0],
            filter = jsEdn.vals[0];

        expect(jsEdn).toEqual(jasmine.any(jsedn.Map));
        expect(tagMap).toEqual(jasmine.any(jsedn.Tagged));
        expect(tagMap.obj()).toEqual('abc-123');
        expect(tagMap.tag().namespace).toEqual('uuid');
        expect(filter).toEqual(true);
      });

      it('should properly convert conditions with \'complex\' filters', function () {
        var cond = new ZermeloCondition('uuid', 'abc-123');
        cond.setFilter(['>=', 10]);

        var jsEdn = cond.toEdn(),
            tagMap = jsEdn.keys[0],
            filterList = jsEdn.vals[0],
            filterSym = filterList.val[0],
            filterValue = filterList.val[1];

        expect(jsEdn).toEqual(jasmine.any(jsedn.Map));
        expect(tagMap).toEqual(jasmine.any(jsedn.Tagged));
        expect(tagMap.obj()).toEqual('abc-123');
        expect(tagMap.tag().namespace).toEqual('uuid');
        expect(filterList).toEqual(jasmine.any(jsedn.List));
        expect(filterSym).toEqual(jasmine.any(jsedn.Symbol));
        expect(filterSym.val).toEqual('>=');
        expect(filterValue).toEqual(10);
      });

    });

  });

})();
