# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 11/24/15 - 1.0.0
- initial release

## 11/25/15 - 1.0.1
- switched $timeout in confirmToggle to $evalAsync
- fixed bug in liveopsResourceFactory which broke PUT transformers
- added logic to tenantUser which remove status when it is a new tenant user,
  or when the status is unchanged.

## 12/11/15 - 1.0.10
- removed constants that were duplicated from config-ui

## 12/11/15 - 1.0.11
- Fix version tagging

## 12/11/2015 - 1.0.13
- hiding inactive items from query editor selections

## 12/11/15 - 1.0.14
- Allow updating timezone on tenants

## 12/11/15 - 1.0.15
- fixed escalation query time error handling
