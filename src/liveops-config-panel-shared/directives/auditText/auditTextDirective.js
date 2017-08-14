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
          date: '=', // (date) The date to be formatted to 'medium' format and passed to the translate filter as 'date',
          noUsernameFallback: '=' // (bool) if set to true, then we will remove the string "by " so that the final text reads something like, "Created on Oct 15, 2016" instead of "Created by  on Oct 15, 2016"
        },
        template: '{{get()}}',
        link: function ($scope) {
          var nameText;

          function setTextContent(correctUUID, userData) {
            var viableDisplayName =
              correctUUID &&
              userData &&
              userData.$resolved;

            $scope.text = $filter('translate')($scope.translation, {
              displayName: viableDisplayName ? userData.getDisplay() : null,
              date: $filter('date')($scope.date, 'medium')
            });
          }

          function translateText (properUUID, userObj) {
            setTextContent(properUUID, userObj);

            var badDisplayNameString =
            ((!properUUID || !$scope.text.displayName) && $scope.noUsernameFallback === true) ||
            $scope.text.indexOf('by  on') !== -1;

            // if we don't have a good userId or a good user name, or
            // for whatever reason, no name got inserted between "by" and "on",
            // let's remove the word, "by"
            if (badDisplayNameString) {
              nameText = $scope.text;
              $scope.text = nameText.replace('by ', '');
            }
          }

          function generateText (goodUUID) {
            var user;

            // let's avoid making a call to a non-existent user if we're given the
            // dreaded '00000000-0000-0000-0000-000000000000' userId
            if (goodUUID) {
              user = TenantUser.cachedGet({
                id: $scope.userId,
                tenantId: Session.tenant.tenantId
              }, 'AuditTextUsers');

              if (user.$resolved) {
                translateText(goodUUID, user);
              } else {
                // force translateText() to prevent attempting to render
                // a user name by hard-coding the 1st argument to false, even
                // though we have a viable-looking UUID
                translateText(false);
              }
            } else {
              translateText(goodUUID);
            }
          }

          $scope.get = function () {
            var hasUUID = $scope.userId !== undefined && $scope.userId !== '00000000-0000-0000-0000-000000000000';
            generateText(hasUUID);
            return $scope.text;
          };
        }
      };
    }
  ]);
