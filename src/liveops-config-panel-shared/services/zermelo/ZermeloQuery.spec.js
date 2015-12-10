(function () {
  'use strict';

  describe('ZermeloQuery', function () {
    var jsedn,
        ZermeloQuery,
        ZermeloObjectGroup;


    beforeEach(module('liveopsConfigPanel.shared.services'));
    beforeEach(module('liveopsConfigPanel.shared.config'));

    beforeEach(inject(function (_jsedn_, _ZermeloQuery_, _ZermeloObjectGroup_) {
      jsedn = _jsedn_;
      ZermeloQuery = _ZermeloQuery_;
      ZermeloObjectGroup = _ZermeloObjectGroup_;
    }));

    describe('getGroup', function () {
      it('should return a group based on its key', function () {
        var q = new ZermeloQuery();
        q.setGroup('a', {});

        var group = q.getGroup('a');
        expect(group).toEqual({key: 'a', objectGroup: {}});
      });

      it('should return null if the key is not present', function () {
        var q = new ZermeloQuery();
        expect(q.getGroup('a')).toBeNull();
      });
    });

    describe('setGroup', function (){
      it('should add an entry in the list of groups with the given key and object', function () {
        var q = new ZermeloQuery();
        q.setGroup('a', {});
        expect(q.groups.length).toEqual(1);
        expect(q.groups[0].key).toEqual('a');
        expect(q.groups[0].objectGroup).toEqual({});
      });
    });

    describe('removeGroup', function () {
      it('should remove a previously added group if it is present', function () {
        var q = new ZermeloQuery();
        q.setGroup('a', {});
        expect(q.groups.length).toEqual(1);

        q.removeGroup('a');
        expect(q.groups.length).toEqual(0);
      });

      it('should have no affect if the group being removed does not exist', function () {
        var q = new ZermeloQuery();
        q.setGroup('a', {});
        expect(q.groups.length).toEqual(1);

        q.removeGroup('b');
        expect(q.groups.length).toEqual(1);
      });
    });

    describe('fromEdn', function () {
      it('should accept a map as the query', function () {
        var edn = new jsedn.Map();
        expect(ZermeloQuery.fromEdn(edn)).not.toBeNull();
      });

      it('should throw a query must be a map when the query isnt a map', function () {
        var edn = new jsedn.List();
        expect(function () { ZermeloQuery.fromEdn(edn) }).toThrow('query must be a map');
      });

      it('should throw a invalid key in query; must be :after-seconds-in-queue or in [":groups", ":skills"] when key is invalid', function () {
        var edn = jsedn.parse('{ \
          :foo () \
        }');

        expect(function () { ZermeloQuery.fromEdn(edn) }).toThrow('invalid key in query; must be :after-seconds-in-queue OR in [":groups",":skills"]');
      });

      it('should return a query with the appropriate groups', function () {
        var edn = '{ \
          :skills ( \
            and ( \
              and \
              {#uuid "37137e10-9a00-11e5-aa13-c1ae7ae4ed37" (>= 1)} \
            ) \
            ( \
              or \
              {#uuid "f00bfe20-9833-11e5-9ce8-c1ae7ae4ed37" (>= 1)} \
            ) \
          ) \
          :groups ( \
            and ( \
              and \
              {#uuid "37137e10-9a00-11e5-aa13-c1ae7ae4ed37" (>= 1)} \
            ) \
            ( \
              or \
              {#uuid "f00bfe20-9833-11e5-9ce8-c1ae7ae4ed37" (>= 1)} \
            ) \
          ) \
          :after-seconds-in-queue 50 \
        }';

        var query = ZermeloQuery.fromEdn(jsedn.parse(edn));
        expect(query.groups.length).toEqual(2);
        expect(query.groups[1].key).toEqual(':groups');
        expect(query.groups[1].objectGroup instanceof ZermeloObjectGroup).toBeTruthy();
        expect(query.groups[0].key).toEqual(':skills');
        expect(query.groups[0].objectGroup instanceof ZermeloObjectGroup).toBeTruthy();
        expect(query.afterSecondsInQueue).toEqual(50);
      });
    });

    describe('toEdn', function () {
      it('should produce null if there are no groups and allowEmpty is false', function () {
        var q = new ZermeloQuery();
        expect(q.toEdn()).toBeNull();
      });

      it('should produce a map', function () {
        var q = new ZermeloQuery();
        q.afterSecondsInQueue = 50;
        q.setGroup(':skills', new ZermeloObjectGroup())
        var edn = q.toEdn(true);

        expect(edn instanceof jsedn.Map).toBeTruthy();
        expect(edn.at(new jsedn.Keyword(':after-seconds-in-queue'))).toEqual(50);
        expect(edn.at(new jsedn.Keyword(':skills'))).not.toBeNull();
      });

    });

  });

})();
