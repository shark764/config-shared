'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('liveopsConfigPanel.shared');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('liveopsConfigPanel.shared.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('liveopsConfigPanel.shared.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('liveopsConfigPanel.shared.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('liveopsConfigPanel.shared.services')).to.be.ok;
  });
  

});