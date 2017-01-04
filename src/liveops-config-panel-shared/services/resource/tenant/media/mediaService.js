'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('Media', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor', 'emitErrorInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor, emitErrorInterceptor) {

      var Media = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media/:id',
        resourceName: 'Media',
        updateFields: [{
          name: 'name'
        }, {
          name: 'source'
        }, {
          name: 'type'
        }, {
          name: 'properties',
          optional: true
        }, {
          name: 'description',
          optional: true
        }],
        getInterceptor: emitErrorInterceptor,
        queryInterceptor: emitErrorInterceptor,
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Media.prototype.getDisplay = function () {
        return this.name;
      };

      // converts the media list items from UUID's to user-friendly names
      Media.prototype.getListSourceName = function (list) {
        // cycle through every media item in the tenant's list...
        angular.forEach(list, function (mediaItem, key) {
          if (mediaItem.type === 'list') {
            // if the item is a list, cycle though the 'source' property (an array)
            var sourceArray = _.map(mediaItem.source, function (mediaItemSrcId) {
              // in the event that one of the items is an object, change it into
              // an ID string
              if (angular.isObject(mediaItemSrcId)) {
                mediaItemSrcId = mediaItemSrcId.id;
              }

              // return the 'name' property of all of the items in the list
              return _.filter(list, function (listItem) {
                return mediaItemSrcId === listItem.id;
              })[0].name;
            });

            // set the property that the table config will be using
            list[key].mediaSourceName = sourceArray.join(', ');
          } else {
            // if it's not a list, no conversion necessary, just use the source value as is
            list[key].mediaSourceName = mediaItem.source;
          }
        });
      };

      return Media;
    }
  ]);
