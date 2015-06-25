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
	'angular-sortable-view'
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
		 * Design States
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
			.state('design-galleries.list.add', {
				url: '/add-gallery',
				templateUrl : 'partials/design-galleries.add-form.html',
				controller : 'AdminFormController',
				params: {noScroll:true, requireAuth: true}
			})
			.state('design-galleries.list.edit', {
				url: '/:gallerySlug/edit-gallery',
				templateUrl: 'partials/design-galleries.edit-form.html',
				controller: 'AdminFormController',
				params: {noScroll:true, requireAuth: true}
			})
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
				controller: 'AdminFormController',
				params: {requireAuth: true}
			})
			//.state('design-entries.edit.add', {
			//	url: '/add-entry',
			//	templateUrl: 'partials/design-entries.add-form.html',
			//	controller: 'AdminFormController',
			//	params: {noScroll:true, requireAuth: true}
			//})
			.state('design-entries.edit.edit-entry', {
				url: '/edit-entry/:id',
				templateUrl: 'partials/design-entries.edit-form.html',
				controller: 'AdminFormController',
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