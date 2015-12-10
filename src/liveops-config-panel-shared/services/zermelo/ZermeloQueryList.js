(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel.shared.services')
    .factory('ZermeloQueryList', ['_', 'ZermeloQuery', 'jsedn',
      function (_, ZermeloQuery, jsedn) {

        function QueryList() {
          this.queries = [];
        }

        QueryList.prototype.addQuery = function(query) {
          this.queries.push(query);
        };

        QueryList.prototype.removeQuery = function(query) {
          _.pull(this.queries, query);
        };

        QueryList.fromSingleQuery = function(ednQuery) {
          try {
            var q = ZermeloQuery.fromEdn(jsedn.parse(ednQuery)),
                ql = new QueryList();

            ql.addQuery(q);

            return ql;
          } catch (e) { }

          return null;
        };

        QueryList.fromEdn = function (edn) {
          try {
            if(angular.isString(edn)) {
              edn = jsedn.parse(edn);
            }

            if(edn instanceof jsedn.List) {
              var ql = new QueryList();

              for(var i = 0; i < edn.val.length; i++) {
                ql.addQuery(ZermeloQuery.fromEdn(edn.val[i]));

                if(i > 0 && ql.queries[i].afterSecondsInQueue <= ql.queries[i-1].afterSecondsInQueue) {
                  throw 'after-seconds-in-queue must be increasing'
                }
              }

              return ql;
            }

            throw 'query list must be a list';

          } catch (e) { }

          return null;
        };

        QueryList.prototype.toEdn = function (allowEmpty) {
            if(!allowEmpty && this.queries.length === 0) {
              return null;
            }

            var list = new jsedn.List([]);

            for (var i = 0; i < this.queries.length; i++) {
              list.val.push(this.queries[i].toEdn(allowEmpty));
            }

            return list;
        };

        return QueryList;
      }]);

})();
