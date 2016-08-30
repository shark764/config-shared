'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('GlobalRegionsList', ['Alert', '$translate', function(Alert, $translate) {
    // make sure to keep the first two objects ('default' and 'gll') as the first two, since
    // our markup depends on their index in this list to construct the drop down menus.
    var regions = [{
      tenantId: 'default',
      twilioId: 'default',
      display: $translate.instant('twilioRegion.tenantDefault')
    }, {
      tenantId: null,
      twilioId: 'gll',
      display: $translate.instant('twilioRegion.lowestLatency')
    }, {
      tenantId: 'ap-southeast-2',
      twilioId: 'au1',
      display: $translate.instant('twilioRegion.australia')
    }, {
      tenantId: 'sa-east-1',
      twilioId: 'br1',
      display: $translate.instant('twilioRegion.brazil')
    }, {
      tenantId: 'us-west-1',
      twilioId: 'ie1',
      display: $translate.instant('twilioRegion.ireland')
    }, {
      tenantId: 'ap-northeast-1',
      twilioId: 'jp1',
      display: $translate.instant('twilioRegion.japan')
    }, {
      tenantId: 'ap-southeast-1',
      twilioId: 'sg1',
      display: $translate.instant('twilioRegion.singapore')
    }, {
      tenantId: 'us-east-1',
      twilioId: 'us1',
      display: $translate.instant('twilioRegion.usEastCoast')
    }];

    return regions;
  }]);
