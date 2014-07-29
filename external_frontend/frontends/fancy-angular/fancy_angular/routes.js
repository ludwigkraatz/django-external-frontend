define(['fancyPlugin!angular', 'fancyPlugin!currentApp'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
		$routeProvider.when('/list/:filter', {
			templateUrl: 'apps/angular/partials/partial1.html',
			controller: 'ListController'
		});
		$routeProvider.when('/survey/:target', {
			template: ' ',//$sceDelegateProvider.trustAsResourceUrl('http://localhost:8000/js/widgets/survey/partials/survey/v1/survey.html'),
			controller: 'SurveyController'
		});
		$routeProvider.when('/discussion/:target', {
			template: ' ',
			controller: 'DiscussionController'
		});
		$routeProvider.when('/', {
            template: "<span>{{ 'WIDGETS.COMMENT.ACTION' | translate }}</span><span >WIDGETS.COMMENT.ACTION</span>",
            resolve: {redirect: 'version'}
        });
		$routeProvider.otherwise({redirectTo: '/'});
	}]);

});