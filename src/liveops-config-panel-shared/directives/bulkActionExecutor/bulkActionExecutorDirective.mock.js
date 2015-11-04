'use strict';

angular.module('liveopsConfigPanel.shared.directives.bulkAction.mock', ['liveopsConfigPanel.mock'])
  .service('mockBulkActions', ['$q', 'BulkAction', function ($q, BulkAction) {
    var bulkActions = [new BulkAction()];
    bulkActions[0].checked = true;
    spyOn(bulkActions[0], 'execute').and.returnValue($q.when());
    spyOn(bulkActions[0], 'canExecute').and.returnValue(true);

    bulkActions.push(new BulkAction());
    bulkActions[1].checked = true;
    spyOn(bulkActions[1], 'execute').and.returnValue($q.when());
    spyOn(bulkActions[1], 'canExecute').and.returnValue(false);
    
    return bulkActions;
  }]);