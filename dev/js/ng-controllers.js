'use strict';

angular.module('app.controllers', [])

	.controller('BaseController', ['$scope', '$state', '$stateParams',
		function ($scope, $state, $stateParams) {
			$scope.$state = $state;
			$scope.$stateParams = $stateParams;
		}])

	.controller('MenuController', ['$scope', 'Photography', 'DesignGallery',
		function ($scope, Photography, DesignGallery) {
			$scope.galleries = {
				photo : Photography.query(),
				design : DesignGallery.query()
			};
		}])

	.controller('PhotographyController', ['$scope', 'Photography', '$stateParams',
		function ($scope, Photography, $stateParams) {

			if($stateParams.gallerySlug) {
				$scope.slug = $stateParams.gallerySlug;
				$scope.entries = Photography.query({slug: $stateParams.gallerySlug});
			} else {
				$scope.galleries = Photography.query();
			}
		}])

	.controller('DesignGalleryController', ['$scope', 'DesignGallery', '$stateParams',
		function ($scope, DesignGallery, $stateParams) {

			if($stateParams.gallerySlug) {
				$scope.slug = $stateParams.gallerySlug;
				$scope.entries = DesignGallery.query({slug: $stateParams.gallerySlug});
			} else {
				$scope.galleries = DesignGallery.query();
			}
		}])
;