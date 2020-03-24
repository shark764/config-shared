# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2020-03-20
### Added
* CXV1-21080 - Add Custom Interaction Attributes to Realtime Dashboards.

## [1.9.9] - 2019-08-29
### Fixed
- CXV1-19123 - Fixed, add a new parameter to the '/v1/tenants/:tenantId/dashboards/:id' call.

## [1.9.8] - 2019-08-09
### Fixed
- CXV1-19185 - Update WebRTC Region Support.

## [1.9.7] - 2019-06-12
- CXV1-18604 - Adding an attribute to User so we can know if a user is a Platform Administrator

## [1.9.6] - 2019-04-12
### Changed
- Changed Jenkinsfile back to normal pipeline.

## [1.9.5] - 2019-04-11
### Changed
- CXV1-16853 - Adding new attributes to Tenant and Queue entity to handle setting SLA.

## [1.9.4] - 2019-03-20
### Fixed
- CXV1-17476 - Adding version to DispatchMapping object in order to send null values to API.

## [1.9.3] - 2019-01-22
### Fixed
- Removed unnecessary pipeline stage

## [1.9.2] - 2019-01-22
### Added
- Jenkinsfile for new pipeline

## [1.9.1] - 2019-01-08
### Fixed
- CXV1-16611 - Users page now is sending null when externalId is empty.

## [1.9.0]
* CXV1-14794 - Changed CSS for new Side Panel drag icon for Custom Dashboards in RTD.

## [1.8.0]
* CXV1-14881 - Add Twilio regions to the dropdown.

## [1.7.4]
* CXV1-14496 - Update the user detail panel (View/Edit) to show the platform account status as it is defined for the list view.

## [1.7.3]
* CXV1-14495 - Update the user listing page so there are two columns available for user status instead of one.

## [1.7.2]
* CXV1-14071 - Business Hours - Cannot enter Midnight as End Time.

## [1.7.1]
* CXV1-14372 - Replaced empty strings saved for Workstation ID with null

## [1.7.0]
* CXV1-14372 - Added Workstation ID field to TenantUser service for TelStrat QM & Recording Integration

## [1.6.10]
* Fixed help links - Custom Domain is now being used again

## [1.6.9]
* CXV1-14249 - Allow menu dropdowns to have title before dropdown options

## [1.6.8]
* CXV1-10838 - Update user invitation creation/tenant invitation process for SSO

## [1.6.7]
* CXV1-14059 - Fix for Side Panel not being resizable in IE11 when the name is too large

## [1.6.6]
* CXV1-12854 - Branding for quality management

## [1.6.5]
* CXV1-13125 - Pages are Missing Links to Associated Docs.

## [1.6.4]
* CXV1-11557 - Changed word-break property to normal to avoid words gets cut in half in config ui detail panel

## [1.6.3]
* CXV1-8888 - Changed $rootScope.sheet.rules.length to $rootScope.sheet.cssRules.length for FF,Chrome and IE.

## [1.6.2]
* CXV1-13348 - Added else case for empty Custom Domain values.

## [1.6.1]
* CXV1-10832 - Updated Tenant Management service to work with API changes.

## [1.6.0]
* CXV1-13348 - Added service for Custom Domains, using Protected Brandings service.

## [1.5.58]
* CXV1-10832 - Added IDP management on the Tenant Management page

## [1.5.57]
* CXV1-12954 - Re-init the DispositionList/Presence Reasons list after "Cancel" action.

## [1.5.56]
* CXV1-12397 - Fixed bugs related to IDP XML file uploads

## [1.5.55]
* CXV1-12912 - Fix branding for privacy link

## [1.5.54]
* CXV1-12927 - Fix Skills/Groups filtering

## [1.5.53]
* CXV1-12811 - SFC - Add pushEnabled to Salesforce Props

## [1.5.52]
* CXV1-12489 - SSO - Provide tooltip to logout and logback in to config-ui (update)

## [1.5.51]
* CXV1-12489 - SSO - title in dropdown tenant

## [1.5.50]
* CXV1-12395 - SSO - set "Type" dropdown to active configuration type upon selection of item in IDP list table

## [1.5.49]
* CXV1-12576 - Refactor create new/additional Salesforce Integrations

## [1.5.48]
* CXV1-12398 - IDP service update to allow for new XML direct input field

## [1.5.47]
* CXV1-12394 - Prevented current IDP from being disabled

## [1.5.46]
* CXV1-12318 - Remove Inactive Tenants from /me Endpoint Response

## [1.5.45]
* CXV1-8326 - Added validation to prevent users from using reserved words in create Atributte Interface

## [1.5.44]
* CXV1-12488 Replace display text for GVN on Default Gateway dropdown on Tenant Detail panel

## [1.5.43]
* CXV1-10842 - Update forgot password functionality (create flag to tell config-ui whether the current tenant has a CxEngage IDP)

## [1.5.42]
* CXV1-10833 - Added ability to set classes for individual menu items in Tenants dropdown

## [1.5.41]
* CXV1-11824 - Updated Integration service to support GVN (formerly 2600hz)

## [1.5.40]
* CXV1-10835 - Added new service for /me endpoint

## [1.5.39]
* CXV1-11275 - Updated Verint side panel on Integrations page with new fields for (S)FTP, User Sync, QM, and WFM sections

## [1.5.38]
* CXV1-10846 - Add support for Tenant specific deep linked login SSO redirect (for existing user invite and tenant re auth)

## [1.5.37]
* CXV1-10830 - Created service for config-ui IDP management page

## [1.5.36]
* CXV1-11681 - Fixed bug in text search filter that caused search to not pull up email addresses with special characters

## [1.5.35]
* CXV1-10177 - Create UI for new Verint Integration

## [1.5.34]
* CXV1-11056 - Prevent auditTestDirective from calling /users route with undefined userId

## [1.5.33]
* Broadcast added for infinite scroll table

## [1.5.32]
* CXV1-10360 - Added indent and index to dropdown for forced filtering

## [1.5.31]
* CXV1-9310 - Fixed JS console errors that were affecting config-ui

## [1.5.30]
* CXV1-8232 - Fixed issue with flow copying not also copying flow inputs, outputs, and defaults, but on the config-shared side, used the opportunity to add 2 new methods for temporarily storing the value of the most recently saved flow

## [1.5.29]
* No ticket - tweaking to fix deploy test runs

## [1.5.28]
* No ticket - pull s3 bucket url from constant set dynamically in config-ui from env.js

## [1.5.27]
* CXV1-8619 - Adjusted branding logo and favicons to use local assets when used

## [1.5.26]
* CXV1-8619 - Removed extra scroll from table widgets

## [1.5.25]
* CXV1-2085 - Refactored btn primary color for white btn fix

## [1.5.24]
* CXV1-8148 - Further updating of tenant mock to allow for testing to ensure that inactive tenants are excluded from tenant select dropdown in config-ui

## [1.5.23]
* CXV1-8619 - Fixed layout over-scroll break

## [1.5.22]
* CXV1-8143 - Require current password for password update

## [1.5.21]
* CXV1-8597 - Fixed Search Icon override bug

## [1.5.20]
* CXV1-8597 - Fixed white submit button bug

## [1.5.19]
* CXV1-8148 - Updated tenant mock to allow for testing to ensure that inactive tenants are excluded from tenant select dropdown in config-ui

## [1.5.18]
* CXV1-8597 - Branding UI Style bugs

## [1.5.17]
* CXV1-2085 - Branding service adjusted for ease of use. Added apply method on branding service for style overrides.

## [1.5.16]
* CXV1-6501 - Added "active" property to custom stats service to fix broken enable/disable functionality, also fixed JS bug resulting from undefined checkbox object on page load

## [1.5.15]
* CXV1-8111 - Adjusted tests for breaking changes in angular 1.6.3 and upgraded font-awesome to match other repos in build

## [1.5.14]
* CXV1-8111 - Updated angular to 1.6.3 and fixed breaking changes

## [1.5.13]
* CXV1-6456 - Updated Flow Clone feature to allow for cloning of versions and drafts

## [1.5.12]
* CXV1-7975 - Fix bug with Realtime Dashboard Tables Showing Up Empty

## [1.5.11]
* Added method to display Contact Attribute language labels in a list in table

## [1.5.10]
* Make multiboxes autofocus

## [1.5.9]
* Add emit message to let config-ui know that we are toggling all checkboxes in filter (CXV1-3938)

## [1.5.8]
* Allow filters on multiboxes

## [1.5.7]
* Remove max-height from navigation dropdown

## [1.5.6]
* Updated flow service to allow for duplication of flows

## [1.5.5]
* (part of hotfix) Fixed bug that was breaking Integrations upon save of a Twilio integration by removing the unnecessary sdkVersion property from the PUT calls

## [1.5.4]
* Added contact attribute and layout services

## [1.5.3]
* Fixed type of name in GlobalRegionsList "awsId" property

## [1.5.2]
* Removed unnecessary and bug-causing object properties from POSTS to the Integrations api

## [1.5.1]
* Re-added new Twilio regions for Virginia and Oregon Interconnect

## [1.5.0]
* On Integrations page, added 3rd option for authentication method, "no authentication"

## [1.4.9]
* Fixed issues that were preventing Zendesk integrations from saving properly.

## [1.4.8]
* Fixed linting errors

## [1.4.7]
* Added new functionality for processing data for custom integrations on Integration page

## [1.4.6]
* Added new Twilio regions for Virginia and Oregon Interconnect

## [1.4.5]
* Enabled assignment of message templates on users page

## [1.4.4]
* Styling so table header filters can be clicked.
* Deselecting "All" from filter dropdown will deselect all other checkboxes.
* Styling for "group by" header.

## [1.4.3]
* Added services for transfer lists in user details panel on users page

## [1.4.2]
* Added service for transfer lists

## [1.4.1]
* Added message template service

## [1.4.0]
* Added new token service to change authentication to be token-based

## [1.3.19]
* Modified audit-text directive to allow for instances where the user's name is not available

## [1.3.18]
* Added method to media list to get user-friendly media item names for media lists in table on media page

## [1.3.17]
* Added emit on lo-multibox so that other components can know the moment the box is clicked

## [1.3.16]
* Styling for "group by" titles in dropdowns

## [1.3.15]
* CXV1-6012 - Added "group by" functionality to dropdowns

## [1.3.14]
* added service to get 'from' value for messaging interactions

## [1.3.13]
* Add isDefault to reason lists

## [1.3.12]
* Made updates to allow for new "media lists" media type

## [1.3.11]
* Add delete support for API keys

## [1.3.10]
* Modify API key service

## [1.3.9]
* Add API key service

## [1.3.8]
* Add fail message to bulk action executor

## [1.3.6]
* Add name field to integration service

## [1.3.5]
* Update integration service

## [1.3.4]
* Add version property to read-only query

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
