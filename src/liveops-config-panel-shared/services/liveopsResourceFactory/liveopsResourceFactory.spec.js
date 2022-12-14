'use strict';

/*global jasmine : false */

describe('LiveopsResourceFactory', function () {
  describe('ON reset', function() {
    var Resource;
    
    beforeEach(module('liveopsConfigPanel.shared.services'));
    
    beforeEach(inject(['LiveopsResourceFactory',
      function (LiveopsResourceFactory) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });
      }]));
    
    it('should reset object back to $original', function () {
      var resource = new Resource();
      resource.$original = {
        id: 'abc'
      };
      
      resource.id = '123';

      resource.reset();
      
      expect(resource.id).toEqual('abc');
      
    });
    
    it('should ignore $ members', function () {
      var resource = new Resource();
      resource.$original = {
        $id: 'abc'
      };
      
      resource.$id = '123';
      
      resource.reset();
      
      expect(resource.$id).toEqual('123');
    });
  });
  
  describe('queryCache function', function () {
    var Resource,
      $httpBackend;

    beforeEach(module('gulpAngular'));
    beforeEach(module('liveopsConfigPanel.shared.services'));

    beforeEach(inject(['LiveopsResourceFactory', '$httpBackend',
      function (LiveopsResourceFactory, _$httpBackend_) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });
        $httpBackend = _$httpBackend_;
      }]));

    describe('$original copy', function () {
      it('should store a pristine copy of all objects returned on query', function () {

        $httpBackend.whenGET('/endpoint').respond(200, [
          {id: '1'}, {id: '2'}
        ]);

        var resources = Resource.query();

        $httpBackend.flush();

        expect(resources[0].$original.id).toEqual('1');
        expect(resources[1].$original.id).toEqual('2');
      });

      it('should store a pristine copy of the object returned on get', function () {

          $httpBackend.expectGET('/endpoint').respond(200, {id: '1'});

          var resource = Resource.get();

          $httpBackend.flush();

          expect(resource.$original.id).toEqual('1');
      });

      it('should have a function to reset an object back to its original state', function () {

          $httpBackend.expectGET('/endpoint').respond(200, {id: '1'});

          var resource = Resource.get();

          $httpBackend.flush();

          resource.id = 'abc';

          resource.reset();

          expect(resource.id).toEqual('1');
      });
    });
    
    describe('ON cachedQuery', function () {
      beforeEach(inject([
        function () {
          spyOn(Resource, 'query').and.returnValue([]);
        }
      ]));

      it('should return api data on first call', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);
          expect(queryCache.get('key')).toBe(result);
        }
      ]));

      it('should return cached data on second call', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);

          Resource.query = jasmine.createSpy().and.returnValue([{
            id: 'id1'
          }]);

          result = Resource.cachedQuery({}, 'key');

          expect(result.length).not.toEqual(1);
          expect(queryCache.get('key')).toBe(result);
        }
      ]));

      it('should return api data when invalidate is true', inject(['queryCache',
        function (queryCache) {
          var result = Resource.cachedQuery({}, 'key');
          expect(result.length).toEqual(0);
          expect(queryCache.get('key')).toBe(result);

          Resource.query = jasmine.createSpy().and.returnValue([{
            id: 'id1'
          }]);

          result = Resource.cachedQuery({}, 'key', true);

          expect(result.length).toEqual(1);
          expect(result[0].id).toEqual('id1');
          expect(queryCache.get('key')).toBe(result);
        }
      ]));
    });
  });

  describe('USING mock $resource', function () {
    var Resource,
      resourceSpy,
      LiveopsResourceFactory,
      protoUpdateSpy,
      protoSaveSpy,
      givenConfig;

    beforeEach(module('liveopsConfigPanel.shared.services', function ($provide) {
      resourceSpy = jasmine.createSpy('ResourceMock').and.callFake(function (endpoint, fields, config) {
        givenConfig = config;

        protoSaveSpy = jasmine.createSpy('$save');
        protoUpdateSpy = jasmine.createSpy('$update');

        function resource() {
          this.$save = protoSaveSpy;
          this.$update = protoUpdateSpy;
        }

        return resource;
      });

      $provide.value('$resource', resourceSpy);
    }));

    beforeEach(inject(['LiveopsResourceFactory',
      function (_LiveopsResourceFactory_) {
        LiveopsResourceFactory = _LiveopsResourceFactory_;
      }
    ]));

    it('should call the $resource constructor', inject(function () {
      Resource = LiveopsResourceFactory.create({
        endpoint: '/endpoint'
      });

      expect(resourceSpy).toHaveBeenCalledWith('/endpoint', jasmine.any(Object), {
        query: jasmine.any(Object),
        get: jasmine.any(Object),
        update: jasmine.any(Object),
        save: jasmine.any(Object),
        delete: jasmine.any(Object)
      });
    }));

    it('should use given requestUrlFields if defined', inject(function () {
      Resource = LiveopsResourceFactory.create({
        endpoint: '/endpoint', 
        requestUrlFields: {
          title: '@title'
        }
      });

      expect(resourceSpy).toHaveBeenCalledWith('/endpoint', {
        title: '@title'
      }, {
        query: jasmine.any(Object),
        get: jasmine.any(Object),
        update: jasmine.any(Object),
        save: jasmine.any(Object),
        delete: jasmine.any(Object)
      });
    }));

    describe('update config', function () {
      describe('transformRequest function', function () {
        it('should return empty object when not given any updatefields', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint'
          });
          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            someProp: 'someValue',
            anotherProp: 'anotherValue'
          });
          expect(result).toEqual('{}');
        }]));

        it('should only return fields given by updatefields', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint', 
            updateFields: [
              {name: 'myfield'}, 
              {name: 'coolfield'}
            ]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: 'someValue',
            coolfield: 'thats cool',
            uncool: 'not cool at all'
          });
          expect(result).toEqual('{"myfield":"someValue","coolfield":"thats cool"}');
        }]));

        it('should not include null data if its optional', inject([function () {
          LiveopsResourceFactory.create({
              endpoint: '/endpoint', 
              updateFields: [{
                name: 'myfield',
                optional: true
              }]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: null
          });
          expect(result).toEqual('{}');
        }]));

        it('should include null data if its not optional', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint', 
            updateFields: [{
              name: 'myfield',
              optional: false
            }]
          });

          var transformRequest = givenConfig.update.transformRequest;
          var result = transformRequest({
            myfield: null
          });
          expect(result).toEqual('{"myfield":null}');
        }]));
      });

      describe('transformResponse', function () {
        it('should append a function to the transformResponse array to return data from the result object', inject([function () {
          LiveopsResourceFactory.create({
            endpoint: '/endpoint'
          });
          var transformResponse = givenConfig.update.transformResponse[givenConfig.update.transformResponse.length - 1];
          var result = transformResponse({
            result: {
              someProp: 'somevalue'
            }
          });
          expect(result).toEqual({
            someProp: 'somevalue'
          });

          result = transformResponse({
            someProp: 'somevalue'
          });
          expect(result).toEqual({
            someProp: 'somevalue'
          });

          result = transformResponse([]);
          expect(result).toEqual([]);
        }]));
      });
    });

    describe('query config', function () {
      it('should set isArray to true', inject([function () {
        LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        expect(givenConfig.query.isArray).toBeTruthy();
      }]));
    });

    describe('prototype save function', function () {
      it('should call $update if the object exists', inject(['$q', function ($q) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        var resource = new Resource();
        resource.id = 'id1';

        resource.$update = protoUpdateSpy.and.returnValue($q.when({}));
        resource.save();
        expect(protoUpdateSpy).toHaveBeenCalled();
      }]));

      it('should call $save if the object if new', inject(['$q', function ($q) {
        Resource = LiveopsResourceFactory.create({
          endpoint: '/endpoint'
        });

        var resource = new Resource();

        resource.$save = protoSaveSpy.and.returnValue($q.when({}));
        resource.save();
        expect(protoSaveSpy).toHaveBeenCalled();
      }]));
    });
  });
});
