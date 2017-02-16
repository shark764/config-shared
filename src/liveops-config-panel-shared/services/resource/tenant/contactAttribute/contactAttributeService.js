'use strict';

angular.module('liveopsConfigPanel.shared.services')
  .factory('ContactAttribute', ['LiveopsResourceFactory', 'emitErrorInterceptor', 'emitInterceptor', 'cacheAddInterceptor', 'apiHostname', function(LiveopsResourceFactory, emitErrorInterceptor, emitInterceptor, cacheAddInterceptor, apiHostname) {

    function removeNameAndType(req) {
      delete req.objectName;
      delete req.type;
      return req;
    }

    var ContactAttribute = LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/tenants/:tenantId/contacts/attributes/:id',
      resourceName: 'ContactAttribute',
      updateFields: [
        {
          name: 'label',
          required: true
        },
        {
          name: 'objectName'
        },
        {
          name: 'mandatory'
        },
        {
          name: 'default'
        },
        {
          name: 'type'
        },
        {
          name: 'active'
        }
      ],
      getInterceptor: emitErrorInterceptor,
      queryInterceptor: emitErrorInterceptor,
      saveInterceptor: [emitInterceptor, cacheAddInterceptor],
      updateInterceptor: emitInterceptor,
      putRequestTransformer: removeNameAndType
    });

    ContactAttribute.prototype.getDisplay = function() {
      return this.objectName;
    };

    ContactAttribute.prototype.renderLabelList = function(contactAttributeList) {
      angular.forEach(contactAttributeList, function (val, key) {
        if(val.label && Object.keys(val.label).length > 0) {
          var labelObj = val.label;
          var labelList = [];
          for (key in labelObj) {
            labelList.push('<strong>' + key + '</strong>: ' + labelObj[key] + '<br>');
          }
          var sortedLabelList = _.sortBy(labelList);
          val.labelVal = sortedLabelList.join('');
        } else {
          val.labelVal = '';
        }
      });
    };

    return ContactAttribute;

  }]);
