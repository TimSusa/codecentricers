'use strict';

describe('storageService', function() {

  // services
  var $injector;
  var $rootScope;
  var $window;
  var storageService;

  // local objects populated during tests
  var globals;
  var TEST_KEY = 'storage.test';
  var TEST_KEY2 = 'storage.test2';
  var FULL_TEST_KEY;
  var FULL_TEST_KEY2;
  var TEST_BOOL = true;
  var TEST_INT = 42;
  var TEST_FLOAT = 23.42;
  var TEST_STRING = 'localStorage-test-#ffce148f';
  var TEST_OBJECT = {
    stringField: 'localStorage-string-#aacd469d',
    boolField: true,
    intField: 10,
    floatField: 10.11,
    objField: {
      id: 1,
      name: 'objField'
    }
  };

  // App modules required for this test
  //
  beforeEach(module('codecentricers'));

  // Prepare test
  //
  beforeEach(inject(function (_$injector_) {
    // required services
    $injector      = _$injector_;
    $rootScope     = $injector.get('$rootScope');
    globals        = $injector.get('globals');
    storageService = $injector.get('storageService');

    // use global's storage key
    FULL_TEST_KEY = [globals.localStorageKey, TEST_KEY].join('.');
    FULL_TEST_KEY2 = [globals.localStorageKey, TEST_KEY2].join('.');

    // spy on event broadcasting
    spyOn($rootScope, '$broadcast');
  }));

  // Mock local storage service
  //
  beforeEach(function () {
    $window = $injector.get('$window');

    // If the browser is PhantomJS
    if (navigator.userAgent.match(/Phantom/g)) {
      var store = {};
      // mock session storage
      spyOn($window.localStorage, 'getItem').and.callFake(function(key){
        return store[key];
      });

      spyOn($window.localStorage, 'setItem').and.callFake(function(key, value){
        store[key] = value;
      });

      spyOn($window.localStorage, 'removeItem').and.callFake(function (key) {
        delete store[key];
      });

      spyOn($window.localStorage, 'clear').and.callFake(function () {
        store = {};
      });

      // Otherwise
    } else {
      // Mock out the session storage
      var mock = (function() {
        var store = {};
        return {
          getItem: function(key) {
            return store[key];
          },
          setItem: function(key, value) {
            store[key] = value;
          },
          removeItem: function(key) {
            delete store[key];
          },
          clear: function() {
            store = {};
          }
        };
      })();
      Object.defineProperty($window, 'localStorage', { value: mock, writable:true });

      spyOn($window.localStorage, 'getItem').and.callThrough();
      spyOn($window.localStorage, 'setItem').and.callThrough();
      spyOn($window.localStorage, 'removeItem').and.callThrough();
      spyOn($window.localStorage, 'clear').and.callThrough();
    }
  });

  afterEach(function () {
    $window.localStorage.clear();
  });

  it('local storage mock is working', function () {
    // setItem on the mock implementation
    $window.localStorage.setItem(TEST_KEY, TEST_OBJECT);

    // check that the mock returns the expect JSON object
    expect($window.localStorage.getItem(TEST_KEY)).toBe(TEST_OBJECT);
  });

  it('storage service functions exist', function () {
    expect(angular.isFunction(storageService.put)).toBe(true);
    expect(angular.isFunction(storageService.get)).toBe(true);
    expect(angular.isFunction(storageService.remove)).toBe(true);
    expect(angular.isFunction(storageService.clear)).toBe(true);
  });

  describe('put', function () {

    it('persists string data to local storage', function () {
      storageService.put(TEST_KEY, TEST_STRING);
      expect($window.localStorage.setItem).toHaveBeenCalledWith(FULL_TEST_KEY, angular.toJson(TEST_STRING));
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBe(angular.toJson(TEST_STRING));
    });

    it('persists bool data to local storage', function () {
      storageService.put(TEST_KEY, TEST_BOOL);
      expect($window.localStorage.setItem).toHaveBeenCalledWith(FULL_TEST_KEY, angular.toJson(TEST_BOOL));
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBe(angular.toJson(TEST_BOOL));
    });

    it('persists integer data to local storage', function () {
      storageService.put(TEST_KEY, TEST_INT);
      expect($window.localStorage.setItem).toHaveBeenCalledWith(FULL_TEST_KEY, angular.toJson(TEST_INT));
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBe(angular.toJson(TEST_INT));
    });

    it('persists float data to local storage', function () {
      storageService.put(TEST_KEY, TEST_FLOAT);
      expect($window.localStorage.setItem).toHaveBeenCalledWith(FULL_TEST_KEY, angular.toJson(TEST_FLOAT));
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBe(angular.toJson(TEST_FLOAT));
    });

    it('persists object data to local storage', function () {
      storageService.put(TEST_KEY, TEST_OBJECT);
      expect($window.localStorage.setItem).toHaveBeenCalledWith(FULL_TEST_KEY, angular.toJson(TEST_OBJECT));
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBe(angular.toJson(TEST_OBJECT));
    });

  });

  describe('get', function () {

    it('retrieves string data as string from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, angular.toJson(TEST_STRING));
      expect(storageService.get(TEST_KEY)).toBe(TEST_STRING);
    });

    it('retrieves bool data as bool from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, angular.toJson(TEST_BOOL));
      expect(storageService.get(TEST_KEY)).toBe(TEST_BOOL);
    });

    it('retrieves integer data as integer from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, angular.toJson(TEST_INT));
      expect(storageService.get(TEST_KEY)).toBe(TEST_INT);
    });

    it('retrieves float data as float from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, angular.toJson(TEST_FLOAT));
      expect(storageService.get(TEST_KEY)).toBe(TEST_FLOAT);
    });

    it('retrieves object data as object from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, angular.toJson(TEST_OBJECT));
      expect(storageService.get(TEST_KEY)).toEqual(TEST_OBJECT);
    });

    it('retrieves default value on missing key', function () {
      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBeUndefined();
      expect(storageService.get(TEST_KEY, TEST_STRING)).toBe(TEST_STRING);
    });

  });

  describe('remove', function () {

    it('removes the key/value from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, TEST_STRING);
      storageService.remove(TEST_KEY);
      expect($window.localStorage.getItem(TEST_KEY)).toBeUndefined();
      expect(storageService.get(TEST_KEY)).toBeUndefined();
    });

    it('detectes removed key/values when removed externally', function () {
      storageService.put(TEST_KEY, TEST_STRING);
      $window.localStorage.removeItem(FULL_TEST_KEY);
      expect($window.localStorage.getItem(TEST_KEY)).toBeUndefined();
      expect(storageService.get(TEST_KEY)).toBeUndefined();
    });

  });

  describe('clear', function () {

    it('clears all keys from local storage', function () {
      $window.localStorage.setItem(FULL_TEST_KEY, TEST_STRING);
      $window.localStorage.setItem(FULL_TEST_KEY2, TEST_OBJECT);

      storageService.clear();

      expect($window.localStorage.getItem(FULL_TEST_KEY)).toBeUndefined();
      expect($window.localStorage.getItem(FULL_TEST_KEY2)).toBeUndefined();
    });
  });

});
