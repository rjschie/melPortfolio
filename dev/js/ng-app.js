'use strict';

var app = angular.module('app', [
	'ngResource',
	'ngAnimate',
	'ui.router',
	'app.services',
	'app.directives',
	'app.filters',
	'app.controllers',
	'wu.masonry'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/design');

		$httpProvider.interceptors.push(['$q', '$window',
			function($q, $window) {
				return {
					'request' : function(config) {
						config.headers = config.headers || {};

						if($window.localStorage.sessionInfo) {
							var sessionInfo = JSON.parse($window.localStorage.sessionInfo);
							config.headers.Authorization = 'Bearer ' + sessionInfo.token;
						}

						return config;
					}
				}
			}]);

		$stateProvider
		/**
		 * Design States
		 */
			.state('design', {
				url : '/design',
				templateUrl : 'partials/design-galleries.html',
				controller : 'DesignGalleryController'
			})
			.state('design.add-gallery', {
				url: '/add-gallery',
				templateUrl : 'partials/design-galleries-add-form.html',
				controller : 'DesignGalleryAdminController',
				params: {noScroll:true, requireAuth: true}
			})
			.state('design.edit-gallery', {
				url: '/edit-gallery/:gallerySlug',
				templateUrl: 'partials/design-galleries-edit-form.html',
				controller: 'DesignGalleryAdminController',
				params: {noScroll:true, requireAuth: true}
			})
			.state('design.add-entry', {
				url: '/add-entry',
				templateUrl: 'partials/design-entries-add-form.html',
				controller: 'DesignGalleryAdminController',
				params: {requireAuth: true}
			})
			.state('design-gallery', {
				url : '/design/:gallerySlug',
				templateUrl : 'partials/design-entries.html',
				controller : 'DesignGalleryController'
			})
		/**
		 * Photography States
		 */
			.state('photography', {
				url : '/photography',
				templateUrl : 'partials/photography.html',
				controller : 'PhotographyController'
			})
			.state('photo-gallery', {
				url : '/photography/:gallerySlug',
				templateUrl : 'partials/photo-gallery.html',
				controller : 'PhotographyController'
			})
		/**
		 * Other States
		 */
			.state('video', {
				url : '/video',
				templateUrl : 'partials/video.html',
				controller : 'VideoController'
			})
			.state('about', {
				url : '/about',
				templateUrl : 'partials/about.html',
				controller : 'AboutController'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'partials/login.html',
				controller: 'AuthController'
			})
			.state('logout', {
				url: '/logout',
				templateUrl: 'partials/logout.html',
				controller: 'AuthController'
			})
		;
	}
]);