'use strict';

angular.module('app.directives', [])

	/**
	 * The Image Uploader directive will allow for a dropzone
	 * to add the image as Base64 Encoded data URI to the `formData`
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
	 * 		form-data="form"
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
			template: '<img ng-src="{{formData.image}}" ng-show=formData.image>',
			link: function(scope, elem, attrs) {

				var file;
				var fileInput = jQuery('<input type="file">');
				var reader = new FileReader();

				/**
				 * Populate image field if attribute is present
				 */
				if(attrs.imageUploaderImage) {
					scope.$watch('formData', function(newVal) {
						if(newVal) {
							newVal.image = attrs.imageUploaderImage;
						}
					});
				}

				/**
				 * Add file to Form Data via FileReader API
				 */
				function addFile(file) {
					if(file.type.match('image.*')) {
						reader.onload = function(e) {
							scope.formData.new_image = {};
							scope.$apply(function(scope) {
								scope.formData.new_image.data = e.target.result;
								scope.formData.new_image.name = file.name;
								scope.formData.image = e.target.result;
							});
						};

						reader.readAsDataURL(file);
					}
				}

				/**
				 * Bring in File Selection Dialog when clicking dropzone
				 */
				elem.on('click', function() {
					fileInput.trigger('click');
				});

				/**
				 * Add file to Form Data after selection
				 */
				fileInput.on('change', function() {
					file = fileInput[0].files[0];
					addFile(file);
				});

				/**
				 * Stop browser from opening with file:// protocol
				 * Add defined dragClass when dragging
				 */
				elem.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						elem.addClass(attrs.dragClass);
					}
				});

				/**
				 * Remove defined dragClass when no longer dragging
				 */
				elem.on('dragleave', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						elem.removeClass(attrs.dragClass);
					}
				});

				/**
				 * Stop browser from opening with file:// protocol
				 * Add file to Form Data after dropping
				 */
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

	.directive('designGalleryEditBar', function() {
		return {
			templateUrl: 'partials/templates/design-gallery.edit-bar.html',
			restrict: 'A',
			require: '?^svElement',
			controller: function($scope) {
				if( ! $scope.Auth.isAuth) return;

				$scope.editBarMenu = { show: false, confirm: false };

				$scope.editBarMenu.toggleEdit = function() {
					$scope.editBarMenu.show = !$scope.editBarMenu.show;
					$scope.editBarMenu.confirm = false;
				};

				$scope.deleteGallery = function(gallery, index) {
					if($scope.editBarMenu.confirm) {
						gallery.$delete().then(function() {
							$scope.galleries.design.splice(index, 1);
							$scope.editBarMenu.confirm = false;
							$scope.editBarMenu.show = false;
						}, function() {
							console.log("Didn't Delete!");
						});
					}
				};
				$scope.stateChange = function(location, slug) {
					$scope.$state.go(location, {gallerySlug: slug});
				};
			},
			link: function(scope, elem, attrs, ctrl) {
				if(ctrl) {
					ctrl.handle = jQuery(elem).children('.edit-bar-button-drag').add(ctrl.handle);
				}
			}
		}
	})

	.directive('designEntryEditBar', function() {
		return {
			templateUrl: 'partials/templates/design-entry.edit-bar.html',
			restrict: 'A',
			require: '?^svElement',
			controller: function($scope) {
				if( ! $scope.Auth.isAuth) return;

				$scope.editBarMenu = { show: false, confirm: false };

				$scope.editBarMenu.toggleEdit = function() {
					$scope.editBarMenu.show = !$scope.editBarMenu.show;
					$scope.editBarMenu.confirm = false;
				};

				$scope.deleteEntry = function(entry, index) {
					if($scope.editBarMenu.confirm) {
						entry.$delete().then(function() {
							$scope.entries.splice(index, 1);
							$scope.editBarMenu.confirm = false;
							$scope.editBarMenu.show = false;
						}, function() {
							console.log("Didn't Delete!");
						});
					}
				};
				$scope.stateChange = function(location, data) {
					$scope.$state.go(location, data);
				};
			},
			link: function(scope, elem, attrs, ctrl) {
				if(ctrl) {
					ctrl.handle = jQuery(elem).children('.edit-bar-button-drag').add(ctrl.handle);
				}
			}
		}
	})

.directive('editVideoPreview', function() {
		return {
			templateUrl: 'partials/templates/design-entry.edit-video-preview.html',
			restrict: 'AE',
			controller: function($scope) {
				$scope.isArray = function(input) {
					return Array.isArray(input);
				}
			}
		}
	})

;