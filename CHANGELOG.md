# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.3.3]
* Add outboundIntegrationId field to tenants

## [1.3.1]
* Add description field to media items

## [1.2.9]
* Add queryVersion to QueueVersion

## [1.2.8]
* Add supervisor user entity
* Add regions to campaign versions
* Fix basic/advanced query builder bug

## [1.2.7]
* CXV1-2272 - Navigation dropdown menu does not disappear bug fix

## [1.2.1]
* Add group reason list entities

## [1.2.1]
* CXV1-3876 - Added cache key to Capacity Rules entity

## [1.2.0]
* Add resource entities for CapacityRules, CapacityRuleVersions, and Listeners

## [1.1.5]
* Add resource entity for reason list and user associations

## [1.1.4]
* CXV1-1682 - Add resource entity for reason lists

## [1.1.3]
* CXV1-1682 - Add resource entity for disposition lists

## [1.1.2]
* CXV1-1682 - Add resource entities for reasons and dispositions

## [1.1.1]
* Fixed Realtime Dashboard active field
* Fixed Changelog layout

## [1.1.0]
* Added Realtime Dashboard resource type

## [1.0.58]
* Added metadata column to flow drafts and versions

## [1.0.57]
* Fix time filter to account for single digit seconds

## [1.0.56]
* Fix click handler from previous update

## [1.0.55]
* Add filter for displaying recording duration
* Fix bug preventing dropdown menus from dismissing on historical dashboard

## [1.0.54]
* Building with new JSEDN changes

## [1.0.53]
* Fix bug in selectedTableOptions

## [1.0.52]
* Fix table-pane CSS for firefox and IE

## [1.0.51]
* Broadcast a general event in emitInterceptor.
* Move table-controls specific styles out of #table-pane class

## [1.0.50]
* Make activeVersion optional for flows

## [1.0.47]
* Improve lo-form-submit error handling

## [1.0.46]
* Added directive documentation and some cleanup

## [1.0.45]
* Removed "All Users" filter in query editor

## [1.0.44]
* Add custom time picker

## [1.0.43]
* Add api error response interceptor

## [1.0.42]
* Removed all constants except for apiHostName

## [1.0.41]
* Styling fixes for IE11 and IE10

## [1.0.40]
* Update confirmToggle to support a custom function on confirm accept

## [1.0.39]
* Update tenantUser API intercepter to check for presence of Session.tenant before setting user role name

## [1.0.38]
* Add twilio language and voice constants

## [1.0.36]
* Updated list.mock to include tenantId

## [1.0.35]
* Fix bulk actions loading spinner showing after a failed action

## [1.0.34]
* Typeahead updates text display if selectedItem is updated externally

## [1.0.33]
* Added getDisplay to Timezone

## [1.0.32]
* Added resetErrors and newResource filter

## [1.0.31]
* passing 'activeExtension' to TenantUser

## [1.0.30]
* Modify table options filter to not filter items if All is checked

## [1.0.29]
* Add optional key-only params for cachedGet lookup

## [1.0.28]
* Allow updating business hours description

## [1.0.27]
* added a disabled property to autocomplete and typeahead directives

## [1.0.26]
* update dropdown directive to use ui-sref-options to pass state options to ui-router

## [1.0.25]
* possible fix for ie10 flexbox

## [1.0.24]
* added loDuplicateValidator
* loDuplicateValidator accepts two parameters: loDuplicateValidatorOptions and loDuplicateValidatorItems
* loDuplicateValidatorOptions is an object with a comparer key
* the comparer must be a function that returns true or false; it has one argument which is an item in the loDuplicateValidatorItems
* if the function returns true, the validator will count that as a duplicate
* loDuplicateValidatorItems is the list of items that will be validated against the ngModel

## [1.0.21]
* update user filter to use :user-id instead of :id

## [1.0.20]
* added support for selecting a tenant user as the filter condition

## [1.0.19]
* zermelo escalation query now throws an error when key is not :groups or :skills
* requiring a form name to be passed in to the escalation-list-editor; this is
not ideal but will have to do for now.

## [1.0.18]
* Support for custom color themes, and added default theme

## [1.0.15]
* fixed escalation query time error handling

## [1.0.14]
* Allow updating timezone on tenants

## [1.0.13]
* hiding inactive items from query editor selections

## [1.0.11]
* Fix version tagging

## [1.0.10]
* removed constants that were duplicated from config-ui

## [1.0.1]
* switched $timeout in confirmToggle to $evalAsync
* fixed bug in liveopsResourceFactory which broke PUT transformers
* added logic to tenantUser which remove status when it is a new tenant user,
  or when the status is unchanged.

## [1.0.0]
* initial release
