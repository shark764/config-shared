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

## 12/11/15 - 1.0.18
- Support for custom color themes, and added default theme

## 12/14/15 - 1.0.19
- zermelo escalation query now throws an error when key is not :groups or :skills
- requiring a form name to be passed in to the escalation-list-editor; this is
not ideal but will have to do for now.

## 12/14/15 - 1.0.20
- added support for selecting a tenant user as the filter condition

## 12/14/15 - 1.0.21
- update user filter to use :user-id instead of :id

## 12/16/15 - 1.0.24
- added loDuplicateValidator
- loDuplicateValidator accepts two parameters: loDuplicateValidatorOptions and loDuplicateValidatorItems
- loDuplicateValidatorOptions is an object with a comparer key
- the comparer must be a function that returns true or false; it has one argument which is an item in the loDuplicateValidatorItems
- if the function returns true, the validator will count that as a duplicate
- loDuplicateValidatorItems is the list of items that will be validated against the ngModel

## 12/16/15 - 1.0.25
- possible fix for ie10 flexbox

## 12/17/15 - 1.0.26
- update dropdown directive to use ui-sref-options to pass state options to ui-router

## 12/18/15 - 1.0.27
- added a disabled property to autocomplete and typeahead directives

## 12/18/15 - 1.0.28
- Allow updating business hours description

## 12/18/15 - 1.0.29
- Add optional key-only params for cachedGet lookup

## 12/18/15 - 1.0.30
- Modify table options filter to not filter items if All is checked

## 12/18/15 - 1.0.31
- passing 'activeExtension' to TenantUser

## 12/21/15 - 1.0.32
- Typeahead updates text display if selectedItem is updated externally
