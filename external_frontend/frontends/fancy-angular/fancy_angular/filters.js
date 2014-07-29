define(['fancyPlugin!angular', 'fancyPlugin!services', 'fancyPlugin!angularTranslate'], function (angular, services) {
	'use strict';

	/* Filters */

	angular.module('filters', ['services',  'pascalprecht.translate'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}]);
});
