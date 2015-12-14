(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloEscalation', ['_', 'ZermeloEscalationQuery', 'jsedn', 'ZermeloQuery',
      function (_, ZermeloEscalationQuery, jsedn, ZermeloQuery) {

        function Escalation() {
          this.query = new ZermeloEscalationQuery();
          this.afterSecondsInQueue = 0;
        }

        Escalation.ASIQ_KEY = new jsedn.Keyword(':after-seconds-in-queue');
        Escalation.QUERY_KEY = new jsedn.Keyword(':query');

        Escalation.prototype.hasConditions = function () {
          return this.query.hasConditions();
        };

        Escalation.fromSingleQuery = function (query) {
          var e = new Escalation(),
              q = ZermeloQuery.fromEdn(query);

          e.afterSecondsInQueue = 0;
          e.query.groups = q.groups;

          return e;
        };

        Escalation.prototype.toEdn = function (allowEmpty) {
          var map = new jsedn.Map([]);
          map.set(Escalation.ASIQ_KEY, this.afterSecondsInQueue);
          map.set(Escalation.QUERY_KEY, this.query.toEdn(allowEmpty));
          return map;
        };

        Escalation.fromEdn = function (edn) {
          var e = new Escalation();

          if(edn instanceof jsedn.List) {
            return Escalation.fromSimpleQuery(edn);
          }

          if(edn instanceof jsedn.Map) {
            e.afterSecondsInQueue = edn.at(Escalation.ASIQ_KEY);
            e.query = ZermeloEscalationQuery.fromEdn(edn.at(Escalation.QUERY_KEY));

            if(!angular.isNumber(e.afterSecondsInQueue)) {
              throw 'after seconds in queue must be a number';
            }

            return e;
          }

          throw 'escalation query must be a map';
        };

        return Escalation;
      }]);

})();
