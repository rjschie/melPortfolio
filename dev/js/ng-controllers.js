'use strict';

angular.module('app.controllers', [])

	.controller('BaseController', ['$scope', '$state',
		function ($scope, $state) {
			$scope.$state = $state;
		}])

	.controller('PhotographyController', ['$scope', 'Photo',
		function ($scope, Photo) {
			$scope.photos = Photo.query();
		}]);