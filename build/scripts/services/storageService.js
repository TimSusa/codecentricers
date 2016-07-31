'use strict';
/**
  * @ngdoc service
  * @name codecentricers.service:storageService
  * @module codecentricers
  * @kind service
  * @requires $window
  * @requires codecentricers.objects:globals
  *
  * @description
  * Central service for wrapping the browser's window.localStorage object. Stores
  * values under keys in local storage which is restricted by browser implementations
  * to be read from the origin domain only.
  *
  * Keys are prefixed with a value defined in {@link api/codecentricers.objects:globals global configuration}
  * under key `localStorageKey`.
  */
angular.module('codecentricers')

.factory('storageService', [ '$injector', function ($injector) {

  var $window         = $injector.get('$window');
  var globals         = $injector.get('globals');
  var hasLocalStorage = detectLocalStorage();
  var isDefined       = angular.isDefined;
  var storage;

  function detectLocalStorage () {
    try {
      var t = '_codecentricers_localStorage';
      storage = $window.localStorage || localStorage;
      storage.setItem(t, t);
      storage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  }

  function expandKey (key) {
    return [globals.localStorageKey, key].join('.');
  }

  return {
    /**
      * @ngdoc method
      * @name codecentricers.service:storageService#put
      * @methodOf codecentricers.service:storageService
      * @kind function
      *
      * @description
      * Stores value under a given key in local storage. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key   Key to store value under.
      * @param {string} value Value to store.
      *
      */
    put : function (key, value) {
      if (hasLocalStorage && isDefined(value)) {
        storage.setItem(expandKey(key), angular.toJson(value));
      }
    },

    /**
      * @ngdoc method
      * @name codecentricers.service:storageService#get
      * @methodOf codecentricers.service:storageService
      * @kind function
      *
      * @description
      * Retrieves value stored under a given key from local storage. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key           Key to retrieve.
      * @param {value}  defaultValue  Default value returned if key does not exist.
      *
      */
    get : function (key, defaultVal) {
      var v = hasLocalStorage ? storage.getItem(expandKey(key)) : defaultVal;
      if (isDefined(v) && v !== null) {
        // special handling for booleans
        if (v === 'false') {
          return false;
        } else if (v === 'true') {
          return true;
        } else {
          return angular.fromJson(v);
        }
      }

      return defaultVal;
    },

    /**
      * @ngdoc method
      * @name codecentricers.service:storageService#remove
      * @methodOf codecentricers.service:storageService
      * @kind function
      *
      * @description
      * Removes a key/value pair stored in local storage. Does not fail if key
      * does not exist. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key  Key to remove.
      */
    remove : function (key) {
      try {
        storage.removeItem(expandKey(key));
      } catch (e) {}
    },

    /**
      * @ngdoc method
      * @name codecentricers.service:storageService#clear
      * @methodOf codecentricers.service:storageService
      * @kind function
      *
      * @description
      * Removes all key/value pair stored in local storage. Note that this only applies
      * to keys from the current application domain (i.e. Host part of the URL the application
      * was initially loaded from). Does not fail.
      *
      * Note: Keys are NOT prefixed by `localStorageKey`, so any value is deleted!
      *
      */
    clear : function() {
      try {
        storage.clear();
      } catch (e) {}
    }
  };
}]);
