'use strict';

angular.module('app.directives', [])
	.directive('imageUploader', [
		function() {
			return {
				restrict: 'A',
				scope: {
					design_gallery: '='
				},
				//template: '<input ng-model="design_gallery.image" id="image" class="form-input hidden" type="file">',
				link: function($scope, element, attrs) {

					var image = new Image();;

					element.on('dragover', function(event) {
						event.stopPropagation();
						event.preventDefault();
						//element.addClass('dragging');
					});
					//element.on('dragleave', function(event) {
					//	event.stopPropagation();
					//	event.preventDefault();
					//	element.removeClass('dragging');
					//});
					element.on('drop', function(event) {
						event.stopPropagation();
						event.preventDefault();

						element.removeClass('add-sign');

						var file = event.originalEvent.dataTransfer.files[0];

						if(file.type.match('image.*')) {
							var reader = new FileReader();

							reader.onload = function(e) {
								image.src = e.target.result;
								element.append(image);
							};

							reader.readAsDataURL(file);
						}

					});
				}
			}
		}
	])
;