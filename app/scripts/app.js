'use strict';
// VARIANT: codecentricers
/**
  * @ngdoc overview
  * @name codecentricers
  * @module codecentricers
  * @description
  *
  * # codecentricers (core application module)
  * The codecentricers module is loaded when the application is started. The module itself
  * contains all essential components for the application to function.
  *
  * To use the Codecentricers application your HTML page must contain the `ng-app="codecentricers"`
  * tag and also set `<base href="/">` to enable the HTML5 mode history API. Please note
  * that name and location of the minified script may differ from the example and depends
  *  on your build system and web server configuration.
  *
  * @example
  * ```html
    <html ng-app="codecentricers">
    <head>
        <base href="/">
        <script type="text/javascript" src="scripts/codecentricers.min.js"></script>
    </head>
    <body>
    </body>
    </html>
  ```
  *
  *
  * # Browser Compatibility
  *
  * Codecentricers is compatible with all modern web browsers and does not support deprecated
  * browsers such as IE 8 and below. Here is a list of browsers on which the application
  * is verified to run:
  *
  * - Firefox 35 and above (tested on FF 35.0.1)
  * - Chrome 40 and above (tested on FF 40.0.2214.111)
  * - Safari 6 and above (tested on Safari 6.1.6 (7537.78.2))
  */
angular.module( 'codecentricers.resources', [ 'ngResource' ]);
var app = angular.module( 'codecentricers', [
  'ngRoute',
  'codecentricers.resources',
  'codecentricers.templates.html',
  'ui.bootstrap',
]);

app.config(['$provide', function ($provide) {

  // replace $log service with our own version
  $provide.decorator('$log', ['$delegate', 'logService', function ($delegate, logService) {

    // $delegate is the original $log service which we forward calls to
    logService.setDelegate($delegate);

    // return our service instance
    return logService;
  }]);

}])

// enable html5 mode
.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}])

// configure routes
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.

    when('/main-page', {
      bodyClass: 'main-page',
      templateUrl: 'views/main-page.html',
      controller: 'MainPageCtrl',
      controllerAs: 'mpc',
      title: 'Main Page'
    }).
    // home page
    when('/', {
      bodyClass: 'main-page',
      templateUrl: 'views/main-page.html',
      controller: 'MainPageCtrl',
      controllerAs: 'mpc',
      title: 'Main Page'
    }).
    when('/contact', {
      templateUrl: 'views/contact.html',
      title: ' '
    }).
    when('/imprint', {
      templateUrl: 'views/main-page.html'
    }).
    when('/faq', {
      templateUrl: 'views/main-page.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

