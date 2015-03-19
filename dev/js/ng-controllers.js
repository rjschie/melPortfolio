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

	.controller('PhotographyController', ['$scope', 'Photography', 'PhotographyRandom', '$stateParams',
		function ($scope, Photography, PhotographyRandom, $stateParams) {

			if($stateParams.gallerySlug) {
				$scope.slug = $stateParams.gallerySlug;
				$scope.entries = Photography.query({slug: $stateParams.gallerySlug});
			} else {
				$scope.entries = PhotographyRandom.query();
			}
		}])

	.controller('DesignGalleryController', ['$scope', 'DesignGallery', '$stateParams',
		function ($scope, DesignGallery, $stateParams) {

			$scope.playVideo = function(index) {
				var element = jQuery('.container').eq(index);
				var video = element.find('video');
				var webmsrc = element.find('source').attr('src').replace('.mp4', '.webm');
				video.append('<source src="'+webmsrc+'" type="video/webm">');
				element.find('.poster-image, .play-button').hide();
				video.show();
				video[0].play();
				video.on('click', function() {
					if(video[0].paused) {
						video[0].play();
					} else {
						video[0].pause();
					}
				});
			};

			if($stateParams.gallerySlug) {
				$scope.slug = $stateParams.gallerySlug;
				$scope.entries = DesignGallery.query({slug: $stateParams.gallerySlug});
			} else {
				$scope.galleries = DesignGallery.query();
			}
		}])

	.controller('VideoController', ['$scope',
		function($scope) {
			$scope.playVideo = function(index) {
				var element = jQuery('.container').eq(index);
				var video = element.find('video');
				element.find('.poster-image, .play-button').hide();
				video.show();
				video[0].play();
				video.on('click', function() {
					if(video[0].paused) {
						video[0].play();
					} else {
						video[0].pause();
					}
				});
			};
		}])

	.controller('AboutController', ['$scope', 'InstagramFeed',
		function ($scope, InstagramFeed) {
			InstagramFeed.get(function(data) {
				$scope.instagrams = data;
			});
		}])
;