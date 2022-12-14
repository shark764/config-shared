(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloObjectGroup', ['jsedn', '_', 'ZermeloConditionGroup',
      function (jsedn, _, ZermeloConditionGroup) {

        function ObjectGroup() {
          this.andConditions = new ZermeloConditionGroup('and');
          this.orConditions = new ZermeloConditionGroup('or');
        }

        ObjectGroup.prototype.hasConditions = function () {
          return this.andConditions.conditions.length > 0 || this.orConditions.conditions.length > 0;
        };

        ObjectGroup.prototype.toEdn = function (allowEmpty) {
          var list = new jsedn.List([new jsedn.Symbol('and')]),
              conditionGroups = [this.andConditions, this.orConditions];

          for (var i = 0; i < conditionGroups.length; i++) {
            var conditionGroup = conditionGroups[i].toEdn(allowEmpty);

            if(allowEmpty || conditionGroup) {
              list.val.push(conditionGroup);
            }
          }

          return list.val.length > 1 ? list : null;
        };

        ObjectGroup.fromEdn = function (list) {
          if(list instanceof jsedn.List) {
              var og = new ObjectGroup();

              if(list.val[0].val !== 'and') {
                throw 'object group must start with and';
              }

              list.map(function (i) {
                if(i instanceof jsedn.List) {
                  switch (i.at(0).val) {
                    case 'and':
                      og.andConditions = ZermeloConditionGroup.fromEdn(i);
                      break;
                    case 'or':
                      og.orConditions = ZermeloConditionGroup.fromEdn(i);
                      break;
                    default:
                      throw 'condition group must start with \'and\' or \'or\' but found ' + i.at(0).val;
                  }
                }
              });

              return og;
          }

          throw 'object group must be a list';
        };

        return ObjectGroup;
      }]);

})();
