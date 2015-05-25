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

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/design');

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
				params: {noScroll:true}
			})
			.state('design.edit-gallery', {
				url: '/edit-gallery/:gallerySlug',
				templateUrl: 'partials/design-galleries-edit-form.html',
				controller: 'DesignGalleryAdminController',
				params: {noScroll:true}
			})
			.state('design.add-entry', {
				url: '/add-entry',
				templateUrl: 'partials/design-entries-add-form.html',
				controller: 'DesignGalleryAdminController'
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
		;
	}
]);