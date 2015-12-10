(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('QueryListCreatorController', ['$scope', 'ZermeloQueryList', 'ZermeloQuery', 'Modal', '$translate',
      function ($scope, ZermeloQueryList, ZermeloQuery, Modal, $translate) {

        var vm = this;

        $scope.$watch(function (){
          return $scope.queryString;

        }, function (nv) {
          if(!vm.queryList || (nv && nv !== vm.queryList.toEdn().ednEncode())) {

            vm.advancedQuery = nv;

            var ednQuery = null;

            if(_.startsWith(nv, '{')) {
              ednQuery = ZermeloQueryList.fromSingleQuery(nv);
            } else {
              ednQuery = ZermeloQueryList.fromEdn(nv);
            }

            if(ednQuery) {
              return vm.initQueryList(ednQuery);
            }

            vm.isAdvancedMode = true;
            vm.forms.advancedQueryForm.query.$setTouched();
          }
        });

        $scope.$watch(function () {
          return vm.queryList;
        }, function (nv) {
          if(nv) {
            var edn = nv.toEdn();

            if(edn) {
              $scope.queryString = edn.ednEncode();
            } else {
              $scope.queryString = '()';
            }


          }
        }, true);

        vm.minSecondsForQuery = function (i) {
          if(i > 0) {
            return vm.queryList.queries[i - 1].afterSecondsInQueue + 1;
          }

          return 0;
        };

        vm.removeQuery = function (query) {
          if(query.hasConditions()) {
            return Modal.showConfirm({
              message : $translate.instant('queue.query.escalation.level.remove.confirm'),
              okCallback: function () {
                vm.queryList.removeQuery(query);
              }
            });
          }

          return vm.queryList.removeQuery(query);
        };

        vm.addQuery = function () {
          var q = new ZermeloQuery();
          q.afterSecondsInQueue = _.last(vm.queryList.queries).afterSecondsInQueue + 1;
          vm.queryList.addQuery(q);
        };

        vm.advancedQueryChanged = function () {
          var ednQuery = ZermeloQueryList.fromEdn(vm.advancedQuery);

          if(ednQuery) {
            if(!vm.initialAdvancedQuery ) {
              vm.initialAdvancedQuery = ednQuery;
            }

            $scope.queryString = ednQuery.toEdn().ednEncode();
          }
        };

        vm.advancedMode = function () {
          vm.advancedQuery = vm.queryList.toEdn(true).ednEncode();
          vm.initialAdvancedQuery = vm.advancedQuery;
          vm.isAdvancedMode = true;
        };

        vm.basicMode = function () {
          var query = null;

          try {
            query = ZermeloQueryList.fromEdn(vm.advancedQuery);
          } catch (e) {}

          if(!query) {
            return Modal.showConfirm(
              {
                message: $translate.instant('queue.details.version.query.basic.invalid'),
                okCallback: function () {
                  vm.initQueryList(ZermeloQueryList.fromEdn(vm.initialAdvancedQuery));
                  vm.isAdvancedMode = false;
                }
              }
            );
          }

          vm.initQueryList(query);
          vm.isAdvancedMode = false;
        };

        vm.initQueryList = function (queryList) {
          vm.queryList = queryList || new ZermeloQueryList();
        };
    }]);

})();
