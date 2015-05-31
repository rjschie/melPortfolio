'use strict';

angular.module('app.controllers', [])

	.controller('BaseController', ['$rootScope', '$scope', '$state', '$stateParams', '$location', 'AuthServ',
		'Photography', 'DesignGallery',
		function ($rootScope, $scope, $state, $stateParams, $location, AuthServ, Photography, DesignGallery) {
			$scope.$state = $state;
			$scope.$stateParams = $stateParams;

			$scope.Auth = {
				login : function(email, password) {
					AuthServ.login(email, password).then(function(res) {
						$location.url('/');
					}, function(res) {
						$scope.error = res.data.error;
					});
				},
				logout : function() {
					AuthServ.logout();
				},
				isAuth : function() {
					return AuthServ.isAuth();
				}
			};

			$rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
				if( ! toParams.requireAuth) return;
				if( ! $scope.Auth.isAuth()) {
					e.preventDefault();
				}
			});

			$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams) {
				$scope.noScroll = (toParams.noScroll) ? true : false;
			});

			$scope.galleries = {
				photo : Photography.query(),
				design : DesignGallery.query()
			};
		}])

	//.controller('AuthController', ['$scope',
	//	function ($scope) {
	//		$scope.login = function() {};
	//	}])

	.controller('PhotographyController', ['$scope', 'Photography', 'PhotographyRandom', '$stateParams',
		function ($scope, Photography, PhotographyRandom, $stateParams) {

			if($stateParams.gallerySlug) {
				//$scope.slug = $stateParams.gallerySlug;
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
				//$scope.slug = $stateParams.gallerySlug;
				$scope.entries = DesignGallery.query({id: $stateParams.gallerySlug});
			}
		}])

	.controller('DesignGalleryAdminController', ['$scope', 'DesignGallery', 'DesignEntry',
		function($scope, DesignGallery, DesignEntry) {

			if( ! $scope.Auth.isAuth()) {
				return false;
			}

			switch($scope.$state.current.name) {
				case 'design.edit-gallery':
					$scope.galleries.design.$promise.then(function(galleryList) {
						galleryList.forEach(function(gallery, key) {
							if(gallery.slug == $scope.$stateParams.gallerySlug) {
								$scope.formData = angular.copy(gallery);
								$scope.galleryIndex = key;
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
					$scope.$parent.galleries.design[$scope.galleryIndex] = result;
					$scope.$state.go('^');
				}, function(result) {
					$scope.error = 'Failed to save: ' + result.data.error;
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
					$scope.$parent.galleries.design.push(result);
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
		function($scope, InstagramFeed) {
			InstagramFeed.get(function(data) {
				$scope.instagrams = data;
			});
		}])
;