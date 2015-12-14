(function () {
  'use strict';

  /**

    DEPRECATED:

    This class exists to support the old version of queue queries that existed
    before escalation queries were implemented.

  **/

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloQuery', ['_', 'ZermeloObjectGroup', 'jsedn',
      function (_, ZermeloObjectGroup, jsedn) {

        var ALLOWED_KEYS = [':groups', ':skills'];

        function Query() {
          this.groups = [];
          this.afterSecondsInQueue = 0;
        }

        Query.ALLOWED_GROUP_KEYS = ALLOWED_KEYS;

        Query.prototype.hasConditions = function () {
          for(var i = 0; i < this.groups.length; i++) {
              if(this.groups[i].objectGroup.hasConditions()) {
                return true;
              }
          }

          return false;
        };

        Query.prototype.getGroup = function (key) {
          return _.findWhere(this.groups, {key: key}) || null;
        };

        Query.prototype.setGroup = function (key, objectGroup) {
          this.groups.push({
            key: key,
            objectGroup: objectGroup
          });
        };

        Query.prototype.removeGroup = function (key) {
          this.groups = _.filter(this.groups, function (item) {
            return item.key !== key;
          });
        };

        Query.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);

          for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i],
                key = group.key,
                list = group.objectGroup.toEdn(allowEmpty);

            if(allowEmpty || list) {
              map.set(new jsedn.Keyword(key), list);
            }
          }

          return map;
        };

        Query.fromEdn = function (map) {

          if(map instanceof jsedn.Map) {
            var query = new Query(),
                keys = map.keys;

            for(var i = 0; i < keys.length; i++) {
              var key = keys[i];

              if (_.includes(ALLOWED_KEYS, key.val)) {
                query.setGroup(key.val, ZermeloObjectGroup.fromEdn(map.at(key)));
              } else {
                throw 'invalid key in query; must be in ' + angular.toJson(ALLOWED_KEYS);
              }
            }

            return query;
          }

          throw 'query must be a map';

        };

        return Query;
      }]);

})();
