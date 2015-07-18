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
				if( ! toParams.requireAuth) {
					return;
				}
				if( ! $scope.Auth.isAuth) {
					e.preventDefault();
				}
			});
			$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams) {
				$scope.noScroll = (toParams.noScroll) ? true : false;
				$scope.error = null;
			});

			$rootScope.hideMenu = false;

			$scope.galleries = {
				photo : Photography.query(),
				design : DesignGallery.query()
			};
		}])

	.controller('DesignGalleryController', ['$scope', 'DesignGallery', 'DesignEntry', '$stateParams',
		function ($scope, DesignGallery, DesignEntry, $stateParams) {
			if($scope.entries == undefined && $scope.$state.includes('design-entries')) {
				$scope.entries = DesignEntry.query({id: $stateParams.gallerySlug});
			}
		}])

	.controller('DesignAdminFormController', ['$scope', '$controller', 'DesignGallery', 'DesignEntry',
		'Upload',
		function($scope, $controller, DesignGallery, DesignEntry, Upload) {
			if( ! $scope.Auth.isAuth) {return false;}

			$controller('DesignGalleryController', {$scope: $scope});

			$scope.$on('$destroy', function() {
				$scope.formData = {};
			});
			$scope.update = function(formData) {
				if(formData.type == 1 && Array.isArray(formData.video_url)) { // If Video Item
					$scope.uploadProgress = '0';
					Upload.upload({
						url: '../api/design_entries/storeVideo',
						fileFormDataName: 'video_url',
						file: formData.video_url
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.uploadProgress = progressPercentage + '%';
					}).then(function(result) {
						formData.video_url = result.data.video_url;
						formData.$update().then(function(result) {
							if( $scope.model[$scope.index ].gallery_id != result.gallery_id ) {
								$scope.model.splice($scope.index, 1);
								$scope.$state.go('^');
							} else {
								$scope.model[$scope.index] = result;
								$scope.$state.go('^');
							}
						}, function(result) {
							$scope.error = 'Failed to save: ' + result.data.error;
							console.log("Error: " + JSON.stringify(result.data));
						});
					},function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});

				} else {
					formData.$update().then(function(result) {
						if( $scope.model[$scope.index ].gallery_id != result.gallery_id ) {
							$scope.model.splice($scope.index, 1);
							$scope.$state.go('^');
						} else {
							$scope.model[$scope.index] = result;
							$scope.$state.go('^');
						}
					}, function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});
				}

			};
			$scope.save = function(formData) {
				var formModel;

				switch($scope.$state.current.name) {
					case 'design-galleries.edit.add-gallery':
						formModel = new DesignGallery(formData);
						$scope.model = $scope.$parent.galleries.design;
						break;
					case 'design-entries.edit.add-entry':
						formModel = new DesignEntry(formData);
						$scope.model = $scope.$parent.entries;
						break;
					default:
						break;
				}
				if(formModel.type == 1) { // If Video Item
					$scope.uploadProgress = '0';

					Upload.upload({
						url: '../api/design_entries',
						fields: formData,
						fileFormDataName: 'video_url',
						file: formData.video_url
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.uploadProgress = progressPercentage + '%';
					}).then(function(result) {
						$scope.model.push( angular.extend(formModel,result.data) );
						$scope.$state.go('^');
					},function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});
				} else {
					formModel.$save().then(function(result) {
						$scope.model.push(result);
						$scope.$state.go('^');
					},function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});
				}

			};
			$scope.clear = function() {
				$scope.$parent.formData = {};
				$scope.$$childHead.formData = {};
				$scope.formData = {};
			};

		}])

	.controller('DesignGalleryEdit', ['$scope', '$controller', 'DesignGallery',
		function($scope, $controller, DesignGallery) {

			$controller('DesignAdminFormController', {$scope: $scope});

			$scope.galleries.design.$promise.then(function(galleryList) {
				galleryList.forEach(function(gallery, key) {
					if(gallery.slug == $scope.$stateParams.gallerySlug) {
						$scope.formData = angular.copy(gallery);
						$scope.model = $scope.$parent.galleries.design;
						$scope.index = key;
					}
				});
			});
			$scope.updateSort = function($part) {
				var data = [];
				var orig = [];
				for(var i = 0, len = $part.length; i < len; i++) {
					var item = $part[i];
					orig[item.id] = item.sort_pos;
					item.sort_pos = i+1;
					data[item.id] = { id : item.id, sort_pos: item.sort_pos };
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

		}])

	.controller('DesignEntryEdit', ['$scope', '$controller', 'DesignEntry',
		function($scope, $controller, DesignEntry) {

			$controller('DesignAdminFormController', {$scope: $scope});

			if($scope.$state.is('design-entries.edit.edit-entry')) {
				$scope.entries.$promise.then(function(entryList) {
					entryList.forEach(function(entry, key) {
						if(entry.id == $scope.$stateParams.id) {
							$scope.formData = angular.copy(entry);
							$scope.model = $scope.$parent.entries;
							$scope.index = key;
						}
					});
				});
			} else {
				$scope.galleries.design.$promise.then(function(galleryList) {
					galleryList.forEach(function(gallery, key) {
						if( gallery.slug == $scope.$stateParams.gallerySlug ) {
							$scope.formData = { gallery_id: gallery.id };
						}
					});
				});
			}
			$scope.updateSort = function($part) {
				var data = {};
				var entries = {};
				var orig = [];

				for(var i = 0, len = $part.length; i < len; i++) {
					var item = $part[i];
					orig[item.id] = item.sort_pos;
					item.sort_pos = i+1;
					entries[item.id] = { id : item.id, sort_pos: item.sort_pos };
				}

				data.gallery_id = $part[0].gallery_id;
				data.entries = entries;

				DesignEntry.reorder(data).$promise.then(function() {
					//console.log('success');
				}, function() {
					console.log( 'error' );
					for(var i=0; i < $part.length; i++) {
						$part[i].sort_pos = orig[$part[i].id];
					}
					$part.sort(function(a,b) {
						return a.sort_pos - b.sort_pos;
					});
				});

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

	.controller('VideoController', ['$scope', 'Video',
		function($scope, Video) {
			$scope.videos = Video.query();
		}])

	.controller('VideoEdit', ['$scope', '$controller', 'Video', 'Upload',
		function($scope, $controller, Video, Upload) {

			$controller('VideoController', {$scope: $scope});

			$scope.$on('$destroy', function() {
				$scope.formData = {};
			});
			$scope.videos.$promise.then(function(videoList) {
				videoList.forEach(function(video, key) {
					if(video.id == $scope.$stateParams.id) {
						$scope.formData = angular.copy(video);
						$scope.model = $scope.$parent.videos;
						$scope.index = key;
					}
				});
			});
			$scope.update = function(formData) {
				if(Array.isArray(formData.video_url)) { // If Video Item
					$scope.uploadProgress = '0';
					Upload.upload({
						url: '../api/design_entries/storeVideo',
						fileFormDataName: 'video_url',
						file: formData.video_url
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.uploadProgress = progressPercentage + '%';
					}).then(function(result) {
						formData.video_url = result.data.video_url;
						formData.$update().then(function(result) {
							$scope.model[$scope.index] = result;
							$scope.$state.go('^');
						}, function(result) {
							$scope.error = 'Failed to save: ' + result.data.error;
							console.log("Error: " + JSON.stringify(result.data));
						});
					},function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});
				} else {
					formData.$update().then(function(result) {
						$scope.model[$scope.index] = result;
						$scope.$state.go('^');
					}, function(result) {
						$scope.error = 'Failed to save: ' + result.data.error;
						console.log("Error: " + JSON.stringify(result.data));
					});
				}
			};
			$scope.save = function(formData) {
				var formModel = new Video(formData);
				$scope.model = $scope.$parent.videos;
				$scope.uploadProgress = '0';

				Upload.upload({
					url: '../api/videos',
					fields: formData,
					fileFormDataName: 'video_url',
					file: formData.video_url
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					$scope.uploadProgress = progressPercentage + '%';
				}).then(function(result) {
					$scope.model.push( angular.extend(formModel,result.data) );
					$scope.$state.go('^');
				},function(result) {
					$scope.error = 'Failed to save: ' + result.data.error;
					console.log("Error: " + JSON.stringify(result.data));
				});

			};
			$scope.clear = function() {
				$scope.$parent.formData = {};
				$scope.$$childHead.formData = {};
				$scope.formData = {};
			};
			$scope.updateSort = function($part) {
				var data = [];
				var orig = [];
				for(var i = 0, len = $part.length; i < len; i++) {
					var item = $part[i];
					orig[item.id] = item.sort_pos;
					item.sort_pos = i+1;
					data[item.id] = { id : item.id, sort_pos: item.sort_pos };
				}
				Video.reorder(data).$promise.then(function() {
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

		}])

	.controller('AboutController', ['$scope', 'InstagramFeed',
		function($scope, InstagramFeed) {
			InstagramFeed.get(function(data) {
				$scope.instagrams = data;
			});
		}])
;