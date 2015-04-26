'use strict';

angular.module('app.directives', [])

	/**
	 * The Image Uploader directive will allow for a dropzone
	 * to add the image as Base64 Encoded data URI to the `formData`
	 * that was passed into it.
	 *
	 * Attributes:
	 * 	"form-data":required		=> form data scope value
	 * 	"drag-class":optional		=> name of class to use while dragging file over
	 *
	 * Use:
	 * 	<div imageUploader form-data="form" [drag-class="dragging-class"]></div>
	 *
	 */
	.directive('imageUploader',	function() {
		return {
			restrict: 'A',
			scope: {
				formData: '='
			},
			template: '<img ng-src="{{formData.new_image.data}}" ng-show=formData.new_image>',
			link: function(scope, element, attrs) {

				var file;
				var fileInput = $('<input type="file">');
				var reader = new FileReader();

				/**
				 * Add file to Form Data via FileReader API
				 *
				 * @param file
				 */
				function addFile(file) {
					if(file.type.match('image.*')) {
						reader.onload = function(e) {
							scope.formData.new_image = {};
							scope.$apply(function(scope) {
								scope.formData.new_image.data = e.target.result;
								scope.formData.new_image.name = file.name;
							});
						};

						reader.readAsDataURL(file);
					}
				}

				/**
				 * Bring in File Selection Dialog when clicking dropzone
				 */
				element.on('click', function() {
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
				element.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						element.addClass(attrs.dragClass);
					}
				});

				/**
				 * Remove defined dragClass when no longer dragging
				 */
				element.on('dragleave', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if(attrs.dragClass) {
						element.removeClass(attrs.dragClass);
					}
				});

				/**
				 * Stop browser from opening with file:// protocol
				 * Add file to Form Data after dropping
				 */
				element.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
					file = event.originalEvent.dataTransfer.files[0];
					addFile(file);
				});
			}
		}
	})
;