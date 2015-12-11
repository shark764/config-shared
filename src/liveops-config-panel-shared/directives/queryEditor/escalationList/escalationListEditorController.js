(function () {
  'use strict';

  angular.module('liveopsConfigPanel.shared.directives')
    .controller('EscalationListEditorController', ['$scope', 'ZermeloEscalationList', 'ZermeloEscalation', 'Modal', '$translate', '_',
      function ($scope, ZermeloEscalationList, ZermeloEscalation, Modal, $translate, _) {

        var vm = this;

        $scope.$watch(function (){
          return $scope.queryString;

        }, function (nv) {
          if(!vm.escalationList || (nv && nv !== vm.escalationList.toEdn().ednEncode())) {

            vm.advancedQuery = nv;

            var ednQuery = ZermeloEscalationList.fromEdn(nv);

            if(ednQuery) {
              return vm.initEscalationList(ednQuery);
            }

            vm.isAdvancedMode = true;
            vm.forms.advancedQueryForm.query.$setTouched();
          }
        });

        $scope.$watch(function () {
          return vm.escalationList;
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
            return vm.escalationList.escalations[i - 1].afterSecondsInQueue + 1;
          }

          return 0;
        };

        vm.removeEscalation = function (escalation) {
          if(escalation.hasConditions()) {
            return Modal.showConfirm({
              message : $translate.instant('queue.query.escalation.level.remove.confirm'),
              okCallback: function () {
                vm.escalationList.removeEscalation(escalation);
              }
            });
          }

          return vm.escalationList.removeEscalation(escalation);
        };

        vm.addEscalation = function () {
          var q = new ZermeloEscalation();
          q.afterSecondsInQueue = _.last(vm.escalationList.escalations).afterSecondsInQueue + 1;
          vm.escalationList.addEscalation(q);
        };

        vm.advancedQueryChanged = function () {
          var ednQuery = ZermeloEscalationList.fromEdn(vm.advancedQuery);

          if(ednQuery) {
            if(!vm.initialAdvancedQuery ) {
              vm.initialAdvancedQuery = ednQuery;
            }

            $scope.queryString = ednQuery.toEdn().ednEncode();
          }
        };

        vm.advancedMode = function () {
          vm.advancedQuery = vm.escalationList.toEdn(true).ednEncode();
          vm.initialAdvancedQuery = vm.advancedQuery;
          vm.isAdvancedMode = true;
        };

        vm.basicMode = function () {
          var query = null;

          try {
            query = ZermeloEscalationList.fromEdn(vm.advancedQuery);
          } catch (e) {}

          if(!query) {
            return Modal.showConfirm(
              {
                message: $translate.instant('queue.details.version.query.basic.invalid'),
                okCallback: function () {
                  vm.initEscalationList(ZermeloEscalationList.fromEdn(vm.initialAdvancedQuery));
                  vm.isAdvancedMode = false;
                }
              }
            );
          }

          vm.initEscalationList(query);
          vm.isAdvancedMode = false;
        };

        vm.initEscalationList = function (escalationList) {
          vm.escalationList = escalationList || new ZermeloEscalationList();
        };
    }]);

})();
