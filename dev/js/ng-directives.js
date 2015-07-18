'use strict';

angular.module('app.directives', [])

	/**
	 * The Image Uploader directive will allow for a dropzone
	 * to add the image data URI (Base64 Encoded) to the `formData` scope
	 * that was passed into it.
	 *
	 * Attributes:
	 * 	"form-data"  (required)		=> form data scope value
	 * 	"drag-class" (optional)		=> name of class to use while dragging file over
	 * 	"image-uploader-image" (optional)	=> location of prepoulated image
	 *
	 * Use:
	 * 	<div
	 * 		imageUploader
	 * 			form-data="form"
	 * 			[drag-class="dragging-class"]
	 * 			[image-uploader-image="{{image.url}}"] >
	 * 	</div>
	 *
	 */
	.directive('imageUploader',	function() {
		return {
			restrict: 'A',
			scope: {
				formData: '='
			},
			template: '' +
				'<span class="grid-container-ratio-inner">' +
					'<img class="grid-image" ' +
								'ng-src="{{formData.image_url}}" ng-show=formData.image_url>' +
				'</span>',
			link: function(scope, elem, attrs) {

				var file;
				var fileInput = jQuery('<input type="file">');
				var reader = new FileReader();

				/** Pre-populate image field if attribute is present **/
				if(attrs.imageUploaderImage) {
					scope.$watch('formData', function(newVal) {
						if(newVal) {
							newVal.image = attrs.imageUploaderImage;
						}
					});
				}

				function addFile(file) {
					if(file.type.match('image.*')) {
						reader.onload = function(e) {
							scope.formData.new_image = {};
							scope.$apply(function(scope) {
								scope.formData.new_image.data = e.target.result;
								scope.formData.new_image.name = file.name;
								scope.formData.image_url = e.target.result;
							});
						};

						reader.readAsDataURL(file);
					}
				}
				elem.on('click', function() {
					fileInput.trigger('click');
				});
				fileInput.on('change', function() {
					file = fileInput[0].files[0];
					addFile(file);
				});
				elem.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						elem.addClass(attrs.dragClass);
					}
				});
				elem.on('dragleave', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						elem.removeClass(attrs.dragClass);
					}
				});
				elem.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
					file = event.originalEvent.dataTransfer.files[0];
					addFile(file);
				});
			}
		}
	})

	.directive('modal', ['$rootScope', function($rootScope) {
		return {
			template: [
				'<div class="modal-overlay js-modal-close-action"></div>',
				'<div class="modal-close-button js-modal-close-action"></div>',
				'<ng-transclude></ng-transclude>'
			].join(''),
			transclude: true,
			link: function(scope, elem, attrs) {
				elem.on('click', '.js-modal-close-action', function() {
					scope.$state.go('^');
				});
				jQuery(window).one('keyup', function(e) {
					if(e.keyCode == 27) {
						scope.$state.go('^');
						console.log("escaped");
					}
				});
			}
		}
	}])

	.directive('designGalleryEditBar', ['$rootScope', function($rootScope) {
		return {
			templateUrl: 'partials/templates/design-gallery.edit-bar.html',
			restrict: 'A',
			require: '?^svElement',
			controller: function($scope) {
				if( ! $scope.Auth.isAuth) return;

				$scope.$on('HIDE-OTHER-POPOVERS', function(event, args) {
					if( args.popover != $scope.editBarMenu ) {
						$scope.editBarMenu.show = false;
						$scope.editBarMenu.confirm = false;
					}
				});

				$scope.editBarMenu = { show: false, confirm: false };

				$scope.editBarMenu.toggleEdit = function() {
					$rootScope.$broadcast('HIDE-OTHER-POPOVERS', {popover: $scope.editBarMenu});
					$scope.editBarMenu.show = !$scope.editBarMenu.show;
					$scope.editBarMenu.confirm = false;
				};
				$scope.deleteGallery = function(gallery, index) {
					if($scope.editBarMenu.confirm) {
						gallery.$delete().then(function() {
							$scope.galleries.design.splice(index, 1);
							$scope.editBarMenu.toggleEdit();
							$scope.editBarMenu.confirm = false;
							$scope.editBarMenu.show = false;
						}, function() {
							console.log("Didn't Delete!");
						});
					}
				};
				$scope.stateChange = function(location, slug) {
					$scope.editBarMenu.toggleEdit();
					$scope.$state.go(location, {gallerySlug: slug});
				};
			},
			link: function(scope, elem, attrs, ctrl) {
				if(ctrl) {
					ctrl.handle = jQuery(elem).children('.edit-bar-button-drag').add(ctrl.handle);
				}
			}
		}
	}])

	.directive('designEntryEditBar', ['$rootScope', function($rootScope) {
		return {
			templateUrl: 'partials/templates/design-entry.edit-bar.html',
			restrict: 'A',
			require: '?^svElement',
			controller: function($scope) {
				if( ! $scope.Auth.isAuth) return;

				$scope.$on('HIDE-OTHER-POPOVERS', function(event, args) {
					if( args.popover != $scope.editBarMenu ) {
						$scope.editBarMenu.show = false;
						$scope.editBarMenu.confirm = false;
					}
				});
				$scope.editBarMenu = { show: false, confirm: false };

				$scope.editBarMenu.toggleEdit = function() {
					$rootScope.$broadcast('HIDE-OTHER-POPOVERS', {popover: $scope.editBarMenu});
					$scope.editBarMenu.show = !$scope.editBarMenu.show;
					$scope.editBarMenu.confirm = false;
				};
				$scope.deleteEntry = function(entry, index) {
					if($scope.editBarMenu.confirm) {
						entry.$delete().then(function() {
							$scope.entries.splice(index, 1);
							$scope.editBarMenu.toggleEdit();
							$scope.editBarMenu.confirm = false;
							$scope.editBarMenu.show = false;
						}, function() {
							console.log("Didn't Delete!");
						});
					}
				};
				$scope.stateChange = function(location, data) {
					$scope.editBarMenu.toggleEdit();
					$scope.$state.go(location, data);
				};
			},
			link: function(scope, elem, attrs, ctrl) {
				if(ctrl) {
					ctrl.handle = jQuery(elem).children('.edit-bar-button-drag').add(ctrl.handle);
				}
			}
		}
	}])

	.directive('videoEditBar', ['$rootScope', function($rootScope) {
		return {
			templateUrl: 'partials/templates/video.edit-bar.html',
			restrict: 'A',
			require: '?^svElement',
			controller: function($scope) {
				if( ! $scope.Auth.isAuth) return;

				$scope.$on('HIDE-OTHER-POPOVERS', function(event, args) {
					if( args.popover != $scope.editBarMenu ) {
						$scope.editBarMenu.show = false;
						$scope.editBarMenu.confirm = false;
					}
				});
				$scope.editBarMenu = { show: false, confirm: false };

				$scope.editBarMenu.toggleEdit = function() {
					$rootScope.$broadcast('HIDE-OTHER-POPOVERS', {popover: $scope.editBarMenu});
					$scope.editBarMenu.show = !$scope.editBarMenu.show;
					$scope.editBarMenu.confirm = false;
				};
				$scope.deleteEntry = function(video, index) {
					if($scope.editBarMenu.confirm) {
						video.$delete().then(function() {
							$scope.videos.splice(index, 1);
							$scope.editBarMenu.toggleEdit();
							$scope.editBarMenu.confirm = false;
							$scope.editBarMenu.show = false;
						}, function() {
							console.log("Didn't Delete!");
						});
					}
				};
				$scope.stateChange = function(location, data) {
					$scope.editBarMenu.toggleEdit();
					$scope.$state.go(location, data);
				};
			},
			link: function(scope, elem, attrs, ctrl) {
				if(ctrl) {
					ctrl.handle = jQuery(elem).children('.edit-bar-button-drag').add(ctrl.handle);
				}
			}
		}
	}])

	.directive('editVideoPreview', function() {
		return {
			templateUrl: 'partials/templates/edit-video-preview.html',
			restrict: 'AE',
			controller: function($scope) {
				$scope.isArray = function(input) {
					return Array.isArray(input);
				}
			}
		}
	})

	.directive( 'videoPlayer', ['$rootScope',	function ($rootScope) {
		return {
			templateUrl: 'partials/templates/video-player.html',
			restrict: 'AE',
			scope: {
				video: '=video'
			},
			controller: function($scope) {
				$scope.video.playing = false;
				$rootScope.videoPlaying = false;
				$scope.video.played = false;
			},
			link: function(scope, elem, attrs) {

				/** Setup Video **/
				var video = elem.find('video');
				var src = 'scope.' + video[0].getAttribute('data-url-model');
				video[0].src = eval(src);
				var videoElement = new MediaElement( video[0], {
					success: function(mediaElement) {
						mediaElement.addEventListener('ended', function(e) {
							scope.$apply(function() {
								scope.video.playing = false;
								$rootScope.videoPlaying = false;
								$rootScope.hideMenu = false;
							});
						}, false);
						mediaElement.addEventListener('pause', function(e) {
							scope.$apply(function() {
								scope.video.playing = false;
								$rootScope.videoPlaying = false;
								if( $rootScope.videoPlayingSwitcher ) {
									$rootScope.hideMenu = true;
									$rootScope.videoPlayingSwitcher = false;
								} else {
									$rootScope.hideMenu = false;
								}
							});
						}, false);
						mediaElement.addEventListener('play', function(e) {
							if( $rootScope.videoPlaying ) {
								$rootScope.$broadcast('PAUSE-OTHER-VIDEOS', {video: scope.video});
							}
							scope.$apply(function() {
								scope.video.playing = true;
								$rootScope.videoPlaying = true;
								$rootScope.hideMenu = true;
							});

							/** Scroll if at left edge of screen to account for Menu hiding **/
							var contentView = angular.element(document.querySelector('.content-full'));
							var contentViewMargin =
										parseInt(window.getComputedStyle(contentView[0]).marginLeft);
							if(window.scrollX < contentViewMargin-20 ) {
								setTimeout(function() {
									window.scrollTo(contentViewMargin-20, 0);
								}, 50);
							}
						}, false);
					},
					error: function(error) {
						console.log( 'error: no video element', error );
					}
				});

				 /** Broadcasted Event Listening: pause video if other videos playing **/
				scope.$on('PAUSE-OTHER-VIDEOS', function(event, args) {
					if( args.video != scope.video ) {
						$rootScope.videoPlayingSwitcher = true;
						videoElement.pause();
					}
				});

				/** Play/Pause Events **/
				var playButton = angular.element(elem[0].querySelector('.play-button-js'));
				var pauseButton = angular.element(elem[0].querySelector('.pause-button-js'));
				playButton.bind('click', function() {
					videoElement.play();
					scope.video.played = true; /** signifies first play **/
				});
				pauseButton.bind('click', function() {
					videoElement.pause();
				});

			}
		}

	}])

;