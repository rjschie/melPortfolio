'use strict';

var app = angular.module('app', [
	//'ngRoute',
	'ui.router',
	'ngResource',
	'app.services',
	'app.filters',
	'app.controllers'
]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/design');

		$stateProvider
			.state('design', {
				url : '/design',
				templateUrl : 'partials/design.html'
			})
			.state('docs', {
				url : '/docs',
				templateUrl : 'partials/docs.html'
			})
			.state('path', {
				url : '/path',
				templateUrl : 'partials/path.html'
			})
			.state('pbr', {
				url : '/pbr',
				templateUrl : 'partials/pbr.html'
			})
			.state('photography', {
				url : '/photography',
				templateUrl : 'partials/photography.html',
				controller : 'PhotographyController'
			})
			.state('sorted', {
				url : '/sorted',
				templateUrl : 'partials/sorted.html'
			})
			.state('typography', {
				url : '/typography',
				templateUrl : 'partials/typography.html'
			})
			.state('valise', {
				url : '/valise',
				templateUrl : 'partials/valise.html'
			})
			.state('video', {
				url : '/video',
				templateUrl : 'partials/video.html'
			})
	}
]);