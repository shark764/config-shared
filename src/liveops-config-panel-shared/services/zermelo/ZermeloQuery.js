(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloQuery', ['_', 'ZermeloObjectGroup', 'jsedn',
      function (_, ZermeloObjectGroup, jsedn) {

        var ALLOWED_KEYS = [':groups', ':skills'],
            ASIQ_KEY = ':after-seconds-in-queue';
        function Query() {
          this.groups = [];
          this.afterSecondsInQueue = null;
        }

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
          if(!allowEmpty && this.groups.length === 0) {
            return null;
          }

          var map = new jsedn.Map();

          if(this.afterSecondsInQueue) {
            map.set(new jsedn.Keyword(ASIQ_KEY), this.afterSecondsInQueue);
          }

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

              if(key.val === ASIQ_KEY) {
                query.afterSecondsInQueue = map.at(key);
              } else if (_.includes(ALLOWED_KEYS, key.val)) {
                query.setGroup(key.val, ZermeloObjectGroup.fromEdn(map.at(key)));
              } else {
                throw 'invalid key in query; must be ' + ASIQ_KEY + ' OR in ' + angular.toJson(ALLOWED_KEYS);
              }
            }

            return query;
          }

          throw 'query must be a map';

        };

        return Query;
      }]);

})();
