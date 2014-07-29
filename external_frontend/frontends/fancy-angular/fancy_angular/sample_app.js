define([
    'fancyPlugin!angular',
    'fancyPlugin!filters',
    'fancyPlugin!services',
    'fancyPlugin!directives',
    'fancyPlugin!controllers',
    'fancyPlugin!angularTranslate',
    'fancyPlugin!angularTranslateService',
    'fancyPlugin!angularTranslateFilter',
    'fancyPlugin!angularTranslateDirective',
    'fancyPlugin!angularAnimate',
    'fancyPlugin!angularRoute',
    ], function (angular) {
        'use strict';

        // Declare app level module which depends on filters, and services
console.log(3)
        return angular.module('fancy_angular', [
            'ngRoute',
            'ngAnimate',
            'pascalprecht.translate',
            'fancy_angular.services',
            'fancy_angular.controllers',
            'fancy_angular.directives',
            'fancy_angular.filters',
        ]).config(['$translateProvider', '$sceDelegateProvider', function($translateProvider, $sceDelegateProvider) {
            $translateProvider.
                useStaticFilesLoader().
                preferredLanguage('de').
                fallbackLanguage(['global', 'de']);
        }]);
});
