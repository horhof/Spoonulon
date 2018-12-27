/** Set up a RequireJS configuration. */

// @ts-ignore
requirejs.config({
  paths: {
    angular: '../../lib/angular',
    debug: '../../lib/debug',
    lodash: '../../lib/lodash',
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    Editor: ['debug']
  }
})

// @ts-ignore
requirejs(['angular', 'debug', 'Editor'], function (angular, debug, Editor) {
  const app = angular.module('app', [])
  app.controller('editor', ['$location', Editor.Editor])
  angular.bootstrap(document, ['app'])
})