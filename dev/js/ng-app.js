'use strict';

var app = angular.module('app', [
	'ngResource',
	'ngAnimate',
	'ui.router',
	'app.services',
	'app.directives',
	'app.filters',
	'app.controllers',
	'wu.masonry',
	'angular-sortable-view',
	'color.picker',
	'ngFileUpload'
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
							if(sessionInfo.hasOwnProperty('token')) {
								config.headers.Authorization = 'Bearer ' + sessionInfo.token;
							}
						}

						return config;
					}
				}
			}]);

		$stateProvider
		/**
		 * Design Gallery States
		 */
			.state('design-galleries', {
				abstract: true,
				url : '/design',
				template: '<ui-view/>'
			})
			.state('design-galleries.list', {
				url: '',
				templateUrl : 'partials/design-galleries.html',
				controller : 'DesignGalleryController'
			})
			.state('design-galleries.edit', {
				url: '/edit',
				templateUrl : 'partials/design-galleries.edit.html',
				controller : 'DesignGalleryEdit',
				params: {requireAuth: true}
			})
			.state('design-galleries.edit.add-gallery', {
				url: '/add-gallery',
				templateUrl : 'partials/design-galleries.add-form.html',
				controller : 'DesignGalleryEdit',
				params: {noScroll:true, requireAuth: true}
			})
			.state('design-galleries.edit.edit-gallery', {
				url: '/:gallerySlug/edit-gallery',
				templateUrl: 'partials/design-galleries.edit-form.html',
				controller: 'DesignGalleryEdit',
				params: {noScroll:true, requireAuth: true}
			})
		/**
		 * Design Entry States
		 */
			.state('design-entries', {
				abstract: true,
				url : '/design/:gallerySlug',
				template: '<ui-view/>'
			})
			.state('design-entries.list', {
				url : '',
				templateUrl : 'partials/design-entries.html',
				controller : 'DesignGalleryController'
			})
			.state('design-entries.edit', {
				url: '/edit',
				templateUrl: 'partials/design-entries.edit.html',
				controller: 'DesignEntryEdit',
				params: {requireAuth: true}
			})
			.state('design-entries.edit.add-entry', {
				url: '/add-entry',
				templateUrl: 'partials/design-entries.add-form.html',
				controller: 'DesignEntryEdit',
				params: {noScroll:true, requireAuth: true}
			})
			.state('design-entries.edit.edit-entry', {
				url: '/edit-entry/:id',
				templateUrl: 'partials/design-entries.edit-form.html',
				controller: 'DesignEntryEdit',
				params: {noScroll:true, requireAuth: true}
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
		 * Video States
		 */
			.state('video', {
				abstract: true,
				url : '/video',
				template: '<ui-view/>'
			})
			.state('video.list', {
				url: '',
				templateUrl : 'partials/video.html',
				controller : 'VideoController'
			})
			.state('video.edit', {
				url: '/edit',
				templateUrl : 'partials/video.edit.html',
				controller : 'VideoEdit',
				params: {requireAuth: true}
			})
			.state('video.edit.add-video', {
				url: '/add-video',
				templateUrl : 'partials/video.add-form.html',
				controller : 'VideoEdit',
				params: {noScroll:true, requireAuth: true}
			})
			.state('video.edit.edit-video', {
				url: '/:id/edit-video',
				templateUrl: 'partials/video.edit-form.html',
				controller: 'VideoEdit',
				params: {noScroll:true, requireAuth: true}
			})


		/**
		 * Other States
		 */
			.state('about', {
				url : '/about',
				templateUrl : 'partials/about.html',
				controller : 'AboutController'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'partials/login.html'
			})
			.state('change-pass', {
				url: '/change-pass',
				templateUrl: 'partials/change-pass.html',
				params: {requireAuth: true}
			})
			.state('logout', {
				url: '/logout',
				controller: function($scope, $location) {
					$scope.Auth.logout();
					$location.url('/');
				}
			})
		;
	}
]);