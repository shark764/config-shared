(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloConditionGroup', ['jsedn', 'ZermeloCondition', '_',
      function (jsedn, ZermeloCondition, _) {

        function ConditionGroup(operator) {
          this.operator = operator;
          this.conditions = [];
        }

        ConditionGroup.prototype.getConditionIdentifiers = function () {
          var ids = [];

          for(var i = 0; i < this.conditions.length; i++) {
            ids.push(this.conditions[i].identifier);
          }

          return ids;
        };

        ConditionGroup.prototype.addCondition = function (condition) {
          this.conditions.push(condition);
        };

        ConditionGroup.prototype.removeCondition = function (condition) {
          _.pull(this.conditions, condition);
        };

        ConditionGroup.prototype.toEdn = function (allowEmpty) {
          var list = new jsedn.List([new jsedn.Symbol(this.operator)]);

          for (var i = 0; i < this.conditions.length; i++) {
            var condition = this.conditions[i].toEdn();

            if(allowEmpty || condition) {
              list.val.push(condition);
            }
          }

          return list.val.length > 1 || allowEmpty ? list : null;
        };

        ConditionGroup.fromEdn = function (edn) {
          if(edn instanceof jsedn.List) {
            var conditionGroup = new ConditionGroup();

            conditionGroup.operator = edn.at(0).val;

            for(var i = 1; i < edn.val.length; i++) {
              conditionGroup.addCondition(ZermeloCondition.fromEdn(edn.val[i]));
            }

            return conditionGroup;
          }

          throw 'condition group must be a list';
        };

        return ConditionGroup;
      }]);

})();
