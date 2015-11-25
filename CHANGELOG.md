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
