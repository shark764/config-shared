(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalationList', ['_', 'ZermeloEscalation', 'jsedn',
      function (_, ZermeloEscalation, jsedn) {

        function EscalationList() {
          this.escalations = [];
        }

        EscalationList.prototype.addEscalation = function(escalation) {
          this.escalations.push(escalation);
        };

        EscalationList.prototype.removeEscalation = function(escalation) {
          _.pull(this.escalations, escalation);
        };

        EscalationList.fromSingleQuery = function(edn) {
          try {

            var ql = new EscalationList();

            ql.addEscalation(ZermeloEscalation.fromSingleQuery(edn));

            return ql;
          } catch (e) { }

          return null;
        };

        EscalationList.fromEdn = function (edn) {
          try {
            if(angular.isString(edn)) {
              var isSingleQuery = _.startsWith(edn, '{');

              edn = jsedn.parse(edn);

              if(isSingleQuery) {
                return EscalationList.fromSingleQuery(edn);
              }
            }

            if(edn instanceof jsedn.Vector) {
              var ql = new EscalationList();

              for(var i = 0; i < edn.val.length; i++) {
                ql.addEscalation(ZermeloEscalation.fromEdn(edn.val[i]));

                if(i > 0 && ql.escalations[i].afterSecondsInQueue <= ql.escalations[i-1].afterSecondsInQueue) {
                  throw 'after-seconds-in-queue must be increasing';
                }
              }

              return ql;
            }

            throw 'escalation list must be a vector';

          } catch (e) { }

          return null;
        };

        EscalationList.prototype.toEdn = function (allowEmpty) {
            if(!allowEmpty && this.escalations.length === 0) {
              return null;
            }

            var list = new jsedn.Vector([]);

            for (var i = 0; i < this.escalations.length; i++) {
              list.val.push(this.escalations[i].toEdn(allowEmpty));
            }

            return list;
        };

        return EscalationList;
      }]);

})();
