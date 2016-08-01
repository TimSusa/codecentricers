'use strict';
/**
 * @ngdoc controller
 * @name codecentricers.controller:MainPageCtrl
 * @module codecentricers
 * @kind controller
 * @requires codecentricers.service:storageService
 * @requires codecentricers.resource:Github
 *
 * @description
 * This controller is supposed to fetch member data via Github resource. Furthermore, the fetched information can
 * be stored in local browser storage. In this manner the fetched information can be used for offline purposes.
 *
 */

angular.module('codecentricers')
.controller('MainPageCtrl', ['$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var storageService   = $injector.get('storageService');
  var Github           = $injector.get('Github');
  var globals          = $injector.get('globals');
  var $log             = $injector.get('$log');
  var log              = globals.debug ? angular.bind(null, $log.debug, 'C[Mainpage]') : angular.noop;

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope
  // 4 Expose methods and properties on the controller instance
  controller.members = [];

  controller.store = store;
  controller.load = load;
  controller.countLangs = countLangs;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  // startup
  init();

  // 6. All the actual implementation goes here

  function init () {

    log('init()');

    Github.queryMembers().$promise
    .then(handleQueryMembersSuccess, printError)
    .then(queryAllMemberRepos);

    // Github.queryMembersByNameAndLang({ userName: 'tom', lang: 'javascript' }).$promise.then(function(blob){
    //   log(blob);
    // });
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#handleQueryMembersSuccess
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * On successful response, this function will handle and sort member data.
    *
    */
  function handleQueryMembersSuccess ( blob ) {
    controller.members = blob.map(function( item ){
        var ret = {};
        ret.login = item.login;
        ret.avatar_url = item.avatar_url;
        return ret;
      });
    return controller.members;
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#printError
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * On not successful response, this function will just print the error.
    *
    */
  function printError ( error ) {
    log(error);
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#handleMemberReposSuccess
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * On successful response, this function will handle and sort the data and furthermore request for
    * the used languages from that repo.
    *
    */
  function handleMemberReposSuccess ( blob ) {
    if ((blob[0] === undefined) && ( blob.length < 1 )) {
      return;
    }
    var ownerName = blob[0].owner.login;

    // Extract reponames
    var repoNames = blob.map(function ( repoItem ) {
      return repoItem.full_name;
    });

    // Find and set reponames to member
    controller.members = controller.members.map(function ( item ) {
      if (item.login === ownerName) {

        // Fetch languages for each repo
        item.repos = repoNames.map(function (repoName) {
          var ret = {
            repoName: repoName
          };
          Github.queryLanguagesByRepo({ userName: item.login, repoName: repoName.split('/')[1] }).$promise
          .then(function (blob) {
            ret.lang = beautifyLanguageInfo(blob);
          }, printError);

          return ret;
        });
      }
      return item;
    });

    return controller.members;
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#queryAllMemberRepos
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * Will query all repositories for all members
    *
    */
  function queryAllMemberRepos () {
    controller.members.map(function (item) {
      Github.queryMemberRepos({ userName: item.login }).$promise.then(handleMemberReposSuccess, printError);
    });
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#beautifyLanguageInfo
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * Beautifies the object response, to have languages and their written bytes lenght availlable.
    *
    */
  function beautifyLanguageInfo ( input ) {
    var ret = [];
    var tmp = JSON.stringify(input).replace(/[.*+?^${}"()|[\]\\]/g, '').replace(/[:]/g, ': ');
    ret = tmp.split(',');
    return ret;
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#load
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * Stores the blob to webstorage.
    *
    */
  function store () {
    log('store(): ');
    // storageService.remove('blobStorage');
    storageService.put('blobStorage', controller.members);
  }

  /**
    * @ngdoc method
    * @name codecentricers.controller:MainPageCtrl#load
    * @methodOf codecentricers.controller:MainPageCtrl
    * @kind function
    *
    * @description
    * Loads the blob from webstorage.
    *
    */
  function load () {
    controller.members = null;
    controller.members = storageService.get('blobStorage');
    log('load(): ');
  }

  function countLangs (  ) {
    log('countLangs():');
    controller.members = controller.members.map( function ( memberItem ) {
      // Prepare Array of results
      var res = globals.pLangs.map( function ( plang ) {
        return { 'lang': plang, 'count': 0 };
      });
      if (memberItem.repos) {
        memberItem.repos.map( function ( repoItem ) {
          var langArray;
          if ( repoItem.lang ) {
            langArray = repoItem.lang.map(function( langItem ) {
              var tmp = langItem.split(':')[0];
              res = res.map( function ( l ) {
                if ( l.lang === tmp ) {
                  l.count++;
                }
                return l;
              });
              return tmp;
            });
          }
        });
      }
      memberItem.langCounts = res;
      return memberItem;
    });
  }
}]);

