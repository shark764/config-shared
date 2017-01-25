'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .service('GlobalRegionsList', ['Alert', '$translate', function(Alert, $translate) {
    // make sure to keep the first two objects ('default' and 'gll') as the first two, since
    // our markup depends on their index in this list to construct the drop down menus.
    var regions = [{
      awsId: 'default',
      twilioId: 'default',
      display: $translate.instant('twilioRegion.tenantDefault')
    }, {
      awsId: null,
      twilioId: 'gll',
      display: $translate.instant('twilioRegion.lowestLatency')
    }, {
      awsId: 'ap-southeast-2',
      twilioId: 'au1',
      display: $translate.instant('twilioRegion.australia')
    }, {
      awsId: 'sa-east-1',
      twilioId: 'br1',
      display: $translate.instant('twilioRegion.brazil')
    }, {
      awsId: 'us-west-1',
      twilioId: 'ie1',
      display: $translate.instant('twilioRegion.ireland')
    }, {
      awsId: 'ap-northeast-1',
      twilioId: 'jp1',
      display: $translate.instant('twilioRegion.japan')
    }, {
      awsId: 'ap-southeast-1',
      twilioId: 'sg1',
      display: $translate.instant('twilioRegion.singapore')
    }, {
      awsId: 'us-east-1',
      twilioId: 'us1',
      display: $translate.instant('twilioRegion.usEastCoast')
    }, {
      awsId: null,
      twilioId: 'us1-tnx',
      display: $translate.instant('twilioRegion.virginiaInterconnect')
    }, {
      awsId: null,
      twilioId: 'us2-tnx',
      display: $translate.instant('twilioRegion.oregonInterconnect')
    }];

    return regions;
  }]);
