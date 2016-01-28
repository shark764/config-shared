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

## 12/20/15 - 1.0.32
- Added resetErrors and newResource filter

## 12/22/15 - 1.0.33
- Added getDisplay to Timezone

## 12/22/15 - 1.0.34
- Typeahead updates text display if selectedItem is updated externally

## 12/22/15 - 1.0.35
- Fix bulk actions loading spinner showing after a failed action

## 12/22/15 - 1.0.36
- Updated list.mock to include tenantId

## 01/07/16 - 1.0.38
- Add twilio language and voice constants

## 01/12/16 - 1.0.39
- Update tenantUser API intercepter to check for presence of Session.tenant before setting user role name

## 01/12/16 - 1.0.40
- Update confirmToggle to support a custom function on confirm accept

## 01/13/16 - 1.0.41
- Styling fixes for IE11 and IE10

## 01/13/16 - 1.0.42
- Removed all constants except for apiHostName

## 01/14/16 - 1.0.43
- Add api error response interceptor

## 01/15/16 - 1.0.44
- Add custom time picker

## 01/17/16 - 1.0.45
- Removed "All Users" filter in query editor

## 01/19/16 - 1.0.46
- Added directive documentation and some cleanup

## 01/21/16 - 1.0.47
- Improve lo-form-submit error handling

## 01/25/16 - 1.0.50
- Make activeVersion optional for flows

## 01/27/16 - 1.0.51
- Broadcast a general event in emitInterceptor. 
- Move table-controls specific styles out of #table-pane class

## 01/28/16 - 1.0.52
- Fix table-pane CSS for firefox and IE