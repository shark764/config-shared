'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('auditText', ['$filter', 'TenantUser', 'Session',
    function ($filter, TenantUser, Session) {
      /** audit-text attribute and element directive
       * Generate formatted audit text like "Created by Titan User on Dec 7, 2015 12:52:46 PM"
       */
      return {
        restrict: 'AE',
        scope: {
          translation: '@', // (string) The translation key, with placeholder for date and optionally 'displayName'
          userId: '=', // (int) Optional userId. If given, User will be queried and the user's display name will be passed to the translate filter as 'displayName'
          date: '=' // (date) The date to be formatted to 'medium' format and passed to the translate filter as 'date'
        },
        template: '{{get()}}',
        link: function ($scope) {
          $scope.get = function () {
            if (!$scope.userId) {
              return  $filter('translate')($scope.translation, {
                date: $filter('date')($scope.date, 'medium')
              });
            }

            var user = TenantUser.cachedGet({
              id: $scope.userId,
              tenantId: Session.tenant.tenantId
            }, 'AuditTextUsers');

            if(user.$resolved) {
              $scope.text = $filter('translate')($scope.translation, {
                displayName: user.getDisplay(),
                date: $filter('date')($scope.date, 'medium')
              });
            }

            return $scope.text;
          };
        }
      };
    }
  ]);