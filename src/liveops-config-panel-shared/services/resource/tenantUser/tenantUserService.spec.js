'use strict';

describe('TenantUser service', function(){
  var TenantUser;
  
  beforeEach(module('liveopsConfigPanel.shared.services'));
  
  beforeEach(inject(['TenantUser', function(_TenantUser_) {
    TenantUser = _TenantUser_;
  }]));
});