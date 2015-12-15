(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalationQuery', ['_', 'jsedn', 'ZermeloObjectGroup', 'Skill', 'Group', 'TenantUser',
      function (_, jsedn, ZermeloObjectGroup, Skill, Group, TenantUser) {

        function EscalationQuery() {
          this.groups = [];
        }

        EscalationQuery.KEY_OBJECTS = {
          ':skills'  : Skill,
          ':groups'  : Group,
          ':user-id' : TenantUser
        };

        EscalationQuery.ALLOWED_KEYS = _.keys(EscalationQuery.KEY_OBJECTS);

        EscalationQuery.prototype.hasConditions = function () {
          for(var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].hasConditions()) {
              return true;
            }
          }

          return false;
        };

        EscalationQuery.prototype.getGroup = function (key) {
          return _.findWhere(this.groups, {key: key}) || null;
        };

        EscalationQuery.prototype.setGroup = function (key, objectGroup) {
          this.groups.push({
            key: key,
            objectGroup: objectGroup
          });
        };

        EscalationQuery.prototype.removeGroup = function (key) {
          this.groups = _.filter(this.groups, function (item) {
            return item.key !== key;
          });
        };

        EscalationQuery.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);

          for(var i = 0; i < this.groups.length; i++) {
              var group = this.groups[i];
              map.set(new jsedn.Keyword(group.key), group.objectGroup.toEdn(allowEmpty));
          }

          return map;
        };

        EscalationQuery.fromEdn = function (edn) {
          var eq = new EscalationQuery();

          if(edn instanceof jsedn.Map) {

            edn.map(function (val, key) {
              if (!_.includes(EscalationQuery.ALLOWED_KEYS, key.val)) {
                throw 'group key must be in ' + angular.toJson(EscalationQuery.ALLOWED_KEYS);
              }

              eq.setGroup(key.val, ZermeloObjectGroup.fromEdn(val));
            });

            return eq;
          }

          throw 'escalation query must be a map';
        };

        return EscalationQuery;
      }]);

})();
