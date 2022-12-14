'use strict';

describe('selectedTableOptions filter', function () {
  var $filter,
    users;

  beforeEach(module('liveopsConfigPanel.shared.filters'));

  beforeEach(inject(['$filter', '$rootScope', function (_$filter_) {
    $filter = _$filter_;
    users = [{
      'status': false,
      'state': 'WRAP',
      'value': 4
    }, {
      'status': true,
      'state': 'NOT_READY',
      'value': 5
    }, {
      'status': true,
      'state': 'READY',
      'value': 6
    }, {
      'status': true,
      'state': 'WRAP',
      'value': 4
    }];
  }]));

  it('should return all users if all the options are checked', inject(function () {
    var fields = [{
      name: 'status',
      header: {
        options: [{
          value: false,
          checked: true
        }, {
          value: true,
          checked: true
        }]
      }
    }];

    var result = $filter('selectedTableOptions')(users, fields);

    expect(result.length).toEqual(4);
  }));

  
});
