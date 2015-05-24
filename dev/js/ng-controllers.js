'use strict';

angular.module('app.controllers', [])

	.controller('BaseController', ['$scope', '$state', '$stateParams', '$rootScope',
		function ($scope, $state, $stateParams, $rootScope) {
			$scope.$state = $state;
			$scope.$stateParams = $stateParams;

			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				$scope.noScroll = (toParams.noScroll) ? true : false;
			});

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

	.controller('DesignGalleryAdminController', ['$scope', 'DesignGallery', 'DesignEntry',
		function($scope, DesignGallery, DesignEntry) {

			switch($scope.$state.current.name) {
				case 'design.edit-gallery':
					$scope.galleries.$promise.then(function(galleryList) {
						galleryList.forEach(function(gallery) {
							if(gallery.id == $scope.$stateParams.id) {
								$scope.formData = gallery;
							}
						});
					});
					break;
				default:
					$scope.formData = {};
					break;
			}

			$scope.update = function(formData) {
				formData.$update().then(function(result) {
					console.log("Success: " + JSON.stringify(result.data));
				}, function(result) {
					console.log("Error: " + JSON.stringify(result.data));
				});
			};

			$scope.save = function(formData) {
				var formModel;

				switch($scope.$state.current.name) {
					case 'design.add-gallery':
						formModel = new DesignGallery(formData);
						break;
					case 'design.add-entry':
						formModel = new DesignEntry(formData);
						break;
				}

				formModel.$save().then(function(result) {
					$scope.$parent.galleries.push(result);
					$scope.$state.go('^');
				},function(result) {
					$scope.error = 'Failed to save: ' + result.data.error;
					console.log("Error: " + JSON.stringify(result.data));
				});
			};

			$scope.clear = function() {
				$scope.formData = {};
			};

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