'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .service('BulkAction', ['$q',
    function ($q) {
      var BulkAction = function () {
        this.checked = false;
      };

      BulkAction.prototype.reset = function reset () {
        this.checked = false;
      };

      BulkAction.prototype.apply = function apply () {};

      BulkAction.prototype.execute = function execute (items) {
        var promises = [];
        var self = this;
        angular.forEach(items, function (item) {
          if(!self.doesQualify(item)) {
            return;
          }
          promises.push($q.when(self.apply(item)));
        });

        return $q.all(promises);
      };

      BulkAction.prototype.canExecute = function canExecute () {
        return true;
      };

      BulkAction.prototype.doesQualify = function doesQualify (item) {
        return true;
      }

      return BulkAction;
    }
  ]);