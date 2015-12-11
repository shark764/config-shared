(function () {
  'use strict';

  xdescribe('ZermeloQuery', function () {
    var jsedn,
        ZermeloQuery,
        ZermeloQueryList;


    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.config'));

    beforeEach(inject(function (_jsedn_, _ZermeloQuery_, _ZermeloQueryList_) {
      jsedn = _jsedn_;
      ZermeloQuery = _ZermeloQuery_;
      ZermeloQueryList = _ZermeloQueryList_;
    }));

    describe('addQuery', function () {
      it('should add a query to the list of queries', function () {
        var ql = new ZermeloQueryList();
        expect(ql.queries.length).toEqual(0);
        ql.addQuery(new ZermeloQuery());
        expect(ql.queries.length).toEqual(1);
      });
    });

    describe('removeQuery', function () {
      it('should remove a query from the list of queries', function () {
        var ql = new ZermeloQueryList();
        var q = new ZermeloQuery();
        ql.queries.push(q);
        expect(ql.queries.length).toEqual(1);
        ql.removeQuery(q);
        expect(ql.queries.length).toEqual(0);
      });
    });

    describe('fromEdn', function () {
      it('should return null if the edn is not a list', function () {
        expect(ZermeloQueryList.fromEdn('')).toBeNull();
      });

      it('should parse a string list properly', function () {
        expect(ZermeloQueryList.fromEdn('()')).not.toBeNull();
      });

      it('should parse a edn List properly', function () {
        expect(ZermeloQueryList.fromEdn(new jsedn.List([]))).not.toBeNull();
      });

      it('should parse a list of queries properly', function () {
        var edn = '( \
          {  } \
          {  } \
        )';

        var ql = ZermeloQueryList.fromEdn(edn);
        expect(ql.queries.length).toEqual(2);

      });

      describe('toEdn', function () {
        it('should return null if the list of queries is null, and allowEmpty is false', function () {
          var ql = new ZermeloQueryList();
          expect(ql.toEdn()).toBeNull();
        });

        it('should return an empty list , and allowEmpty is true', function () {
          var ql = new ZermeloQueryList(),
              edn = ql.toEdn(true);

          expect(edn).not.toBeNull();
          expect(edn.val.length).toEqual(0);
        });

        it('should return a list of queries', function () {
          var ql = new ZermeloQueryList();

          ql.addQuery(new ZermeloQuery());

          var edn = ql.toEdn();

          expect(edn).not.toBeNull();
          expect(edn.val.length).toEqual(1);
        });
      });
    });


  });

})();
