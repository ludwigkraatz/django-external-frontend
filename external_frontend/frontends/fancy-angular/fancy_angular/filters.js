define([
        'fancyPlugin!angular',
        'fancyPlugin!services',
        'fancyPlugin!fancyFrontendConfig',
        'fancyPlugin!angularTranslate'], function (angular, services, frontendConfig) {
    'use strict';

    /* Filters */

    angular.module('filters', ['services',  'pascalprecht.translate'])
        .filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }])
        .filter('cssClass', function() {
            return function(input) {
              return frontendConfig.widgets.prefix +'-'+ input;
            };
        })
        .filter('asID', function() {
            return function(input) {
              return input + '-';
            };
        });
});
