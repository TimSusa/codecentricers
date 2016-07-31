'use strict';
/**
 * @ngdoc service
 * @name codecentricers.resources.service:Github
 * @module codecentricers.resources
 * @kind service
 * @requires $resource
 *
 * @description
 * Central $resource object for RESTful github developer info.
 *
 * ### Example
 *```js
 *```
 */

angular.module('codecentricers.resources').factory('Github', [
  '$resource',
  'globals',

  function($resource, globals) {

    var headers = { 'Authorization': 'token ' + globals.apiToken };

    var queryMembersUrl = [globals.baseUrl, 'orgs', 'codecentric', 'members'].join('/');

    // GET /users/:username/repos
    var queryMemberReposUrl = [globals.baseUrl, 'users', ':userName', 'repos'].join('/');

    // GET /repos/:owner/:repo/languages
    var queryLanguagesByRepoUrl = [globals.baseUrl, 'repos', ':userName', ':repoName', 'languages'].join('/');

    //jscs: disable
    var queryMembersByNameAndLangUrl = [globals.baseUrl, 'search', 'users'].join('/') + '?q=:userName' + '+language:' + ':lang';
    // jscs: enable

    var Github = $resource(queryMembersUrl, {
      userName: '@userName',
      lang: '@lang',
      repoName: '@repoName'
    }, {

      /**
       * @ngdoc method
       * @name codecentricers.resources.service:Github#queryMembers
       * @methodOf codecentricers.resources.service:Github
       * @kind function
       *
       * @description
       * Returns an existing members object. May be called as $resource class method.
       *
       *
       * @returns {$resource} A Github instance with two additional parameters `$promise`
       *                     ([Promise](https://docs.angularjs.org/api/ng/service/$q)) and
       *                     `$resolved` (boolean).
       *
       */
      queryMembers: {
        method: 'GET',
        url: queryMembersUrl,
        isArray: true,
        headers: headers
      },
      /**
       * @ngdoc method
       * @name codecentricers.resources.service:Github#read
       * @methodOf codecentricers.resources.service:Github
       * @kind function
       *
       * @description
       * Returns an object.
       *
       * @param {object} urlParam Object GET /users/:username/repos
       *
       * @returns {$resource} A Github instance with two additional parameters `$promise`
       *                     ([Promise](https://docs.angularjs.org/api/ng/service/$q)) and
       *                     `$resolved` (boolean).
       *
       */
      queryMemberRepos: {
        method: 'GET',
        url: queryMemberReposUrl,
        isArray: true,
        headers: headers
      },
      /**
       * @ngdoc method
       * @name codecentricers.resources.service:Github#read
       * @methodOf codecentricers.resources.service:Github
       * @kind function
       *
       * @description
       * Returns an object.
       *
       * @param {object} urlParam Object GET /repos/:owner/:repo/languages
       *
       * @returns {$resource} A Github instance with two additional parameters `$promise`
       *                     ([Promise](https://docs.angularjs.org/api/ng/service/$q)) and
       *                     `$resolved` (boolean).
       *
       */
      queryLanguagesByRepo: {
        method: 'GET',
        url: queryLanguagesByRepoUrl,
        // isArray: true,
        headers: headers
      },
      queryMembersByNameAndLang: {
        method: 'GET',
        url: queryMembersByNameAndLangUrl,
        // isArray: false,
        headers: headers
      },
    });
    return Github;
  }
]);
