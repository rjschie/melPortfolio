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
				changePass : function(formData) {

					if(formData.new_password !== formData.new_password_confirm) {
						$scope.error = "New Passwords do not match.";
						return false;
					}

					AuthServ.changePass(formData.old_password, formData.new_password)
						.then(function() {
							$location.url('/');
						}, function(res) {
							$scope.error = res.data.error;
						});
				},
				authenticate : function() {
					return AuthServ.authenticate();
				},
				isAuth : false
			};

			$rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

				$scope.Auth.isAuth = ($scope.Auth.authenticate()) ? true : false;

				if( ! toParams.requireAuth) return;
				if( ! $scope.Auth.isAuth) {
					e.preventDefault();
				}

			});

			$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams) {
				$scope.noScroll = (toParams.noScroll) ? true : false;
				$scope.error = null;
			});

			$scope.galleries = {
				photo : Photography.query(),
				design : DesignGallery.query()
			};
		}])

	.controller('PhotographyController', ['$scope', 'Photography', 'PhotographyRandom', '$stateParams',
		function ($scope, Photography, PhotographyRandom, $stateParams) {

			if($stateParams.gallerySlug) {
				$scope.entries = Photography.query({slug: $stateParams.gallerySlug});
			} else {
				$scope.entries = PhotographyRandom.query();
			}
		}])

	.controller('DesignGalleryController', ['$scope', 'DesignGallery', 'DesignEntry', '$stateParams',
		function ($scope, DesignGallery, DesignEntry, $stateParams) {

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

			$scope.updateSort = function($part) {

				if( ! $scope.Auth.isAuth) {
					return false;
				}

				var data = [];
				var orig = [];

				for(var i = 0, len = $part.length; i < len; i++) {
					var item = $part[i];
					orig[item.id] = item.sort_pos;
					item.sort_pos = i+1;
					data.push( { id : item.id, sort_pos: item.sort_pos } );
				}

				DesignGallery.reorder(data).$promise.then(function() {
					//console.log('success');
				}, function() {
					//console.log( 'error' );

					for(var i=0; i < $part.length; i++) {
						$part[i].sort_pos = orig[$part[i].id];
					}
					$part.sort(function(a,b) {
						return a.sort_pos - b.sort_pos;
					});
				});

			};

			if($stateParams.gallerySlug) {
				$scope.entries = DesignEntry.query({id: $stateParams.gallerySlug});
			}
		}])

	.controller('AdminFormController', ['$scope', '$controller', 'DesignGallery', 'DesignEntry',
		function($scope, $controller, DesignGallery, DesignEntry) {

			if( ! $scope.Auth.isAuth) {
				return false;
			}

			$controller('DesignGalleryController', {$scope: $scope});

			switch($scope.$state.current.name) {
				case 'design-galleries.list.edit':
					$scope.galleries.design.$promise.then(function(galleryList) {
						galleryList.forEach(function(gallery, key) {
							if(gallery.slug == $scope.$stateParams.gallerySlug) {
								$scope.formData = angular.copy(gallery);
								$scope.model = $scope.$parent.galleries.design;
								$scope.index = key;
							}
						});
					});
					break;
				case 'design-entries.edit.edit-entry':
					$scope.entries.$promise.then(function(entryList) {
						entryList.forEach(function(entry, key) {
							if(entry.id == $scope.$stateParams.id) {
								$scope.formData = angular.copy(entry);
								$scope.model = $scope.$parent.entries;
								$scope.index = key;
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
					$scope.model[$scope.index] = result;
					$scope.formData = {};
					$scope.$state.go('^');
				}, function(result) {
					$scope.error = 'Failed to save: ' + result.data.error;
					console.log("Error: " + JSON.stringify(result.data));
				});
			};

			$scope.save = function(formData) {
				var formModel;

				switch($scope.$state.current.name) {
					case 'design-galleries.list.add':
						formModel = new DesignGallery(formData);
						break;
					case 'design-entries.edit.add-entry':
						formModel = new DesignEntry(formData);
						break;
					default:
						break;
				}

				formModel.$save().then(function(result) {
					$scope.model.push(result);
					$scope.formData = {};
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