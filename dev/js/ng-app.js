'use strict';

var app = angular.module('app', [
	'ui.router',
	'ngResource',
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
				templateUrl : 'partials/design.html',
				controller : 'DesignGalleryController'
			})
			.state('design-gallery', {
				url : '/design/:gallerySlug',
				templateUrl : 'partials/design-gallery.html',
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
		/**
		 * Form States
		 */
			.state('add-design-gallery', {
				url : '/admin/add-design-gallery',
				templateUrl : 'partials/form.design-gallery.html',
				controller : 'FormController'
			})
		;
	}
]);