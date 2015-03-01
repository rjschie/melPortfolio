'use strict';

var app = angular.module('app', [
	'ui.router',
	'ngResource',
	'app.services',
	'app.filters',
	'app.controllers',
	'akoenig.deckgrid'
]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/design');

		$stateProvider
		/**
		 * Design States
		 */
			.state('design', {
				url : '/design',
				templateUrl : 'partials/design.html'
			})
			.state('docs', {
				url : '/docs',
				templateUrl : 'partials/docs.html'
			})
			.state('valise', {
				url : '/valise',
				templateUrl : 'partials/valise.html'
			})
			.state('sorted', {
				url : '/sorted',
				templateUrl : 'partials/sorted.html'
			})
			.state('typography', {
				url : '/typography',
				templateUrl : 'partials/typography.html'
			})
			.state('path', {
				url : '/path',
				templateUrl : 'partials/path.html'
			})
			.state('pbr', {
				url : '/pbr',
				templateUrl : 'partials/pbr.html'
			})
		/**
		 * Photography States
		 */
			.state('photography', {
				url : '/photography',
				templateUrl : 'partials/photography.html',
				controller : 'PhotographyController'
			})
			.state('lifestyle', {
				url : '/lifestyle',
				templateUrl : 'partials/lifestyle.html'
			})
			.state('portraits', {
				url : '/portraits',
				templateUrl : 'partials/portraits.html'
			})
			.state('editorial', {
				url : '/editorial',
				templateUrl : 'partials/editorial.html'
			})
			.state('travel', {
				url : '/travel',
				templateUrl : 'partials/travel.html'
			})
		/**
		 * Other States
		 */
			.state('video', {
				url : '/video',
				templateUrl : 'partials/video.html'
			});
	}
]);