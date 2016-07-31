'use strict';
angular.module('codecentricers')

.constant('version', {
  revision: '',
  flavor: 'develop',
  built: 'Tue Jul 12 2016 12:03:05',
  version: '1.0.1',
  license: 'MIT'
})

.constant('globals', {
  baseUrl: 'https://api.github.com',
  apiToken: 'ae6fa93a683d7a79fc8685b30f662a568d74f5b3', // 'f2ad7135d7818f5b7334c71ec7214547ea4b90d4',
  apiVersion: '1',
  apiTimeout: 10000,
  pollingDelay: 30000,
  maxStartTime: 120000,
  localStorageKey: 'codecentricers',
  debug: true,
  keepMessages: 20,
  customer:{
    title: 'Codecentricers',
    longtitle: 'Codecentricers - Codecentric Developers',
    name: 'generic',
    domain: 'codecentricers.com',
  },
  menuNav: {
    main: ['home', 'contact'],
    // Content for subnav
    home: [],
    contact: [],
  },
  redirectOnLogin: '/'
});
