'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('GlobalRegionsList', ['Alert', '$translate', function(Alert, $translate) {
    // make sure to keep the first two objects ('default' and 'gll') as the first two, since
    // our markup depends on their index in this list to construct the drop down menus.
    var regions = [{
      awsdId: 'default',
      twilioId: 'default',
      display: $translate.instant('twilioRegion.tenantDefault')
    }, {
      awsdId: null,
      twilioId: 'gll',
      display: $translate.instant('twilioRegion.lowestLatency')
    }, {
      awsdId: 'ap-southeast-2',
      twilioId: 'au1',
      display: $translate.instant('twilioRegion.australia')
    }, {
      awsdId: 'sa-east-1',
      twilioId: 'br1',
      display: $translate.instant('twilioRegion.brazil')
    }, {
      awsdId: 'us-west-1',
      twilioId: 'ie1',
      display: $translate.instant('twilioRegion.ireland')
    }, {
      awsdId: 'ap-northeast-1',
      twilioId: 'jp1',
      display: $translate.instant('twilioRegion.japan')
    }, {
      awsdId: 'ap-southeast-1',
      twilioId: 'sg1',
      display: $translate.instant('twilioRegion.singapore')
    }, {
      awsdId: 'us-east-1',
      twilioId: 'us1',
      display: $translate.instant('twilioRegion.usEastCoast')
    }, {
      awsdId: null,
      twilioId: 'us1-tnx',
      display: $translate.instant('twilioRegion.virginiaInterconnect')
    }, {
      awsdId: null,
      twilioId: 'us2-tnx',
      display: $translate.instant('twilioRegion.oregonInterconnect')
    }];

    return regions;
  }]);
