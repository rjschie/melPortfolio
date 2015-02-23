'use strict';

angular.module('app.controllers', [])

	.controller('BaseController', ['$scope', '$state',
		function ($scope, $state) {
			$scope.$state = $state;
		}])

	.controller('PhotographyController', ['$scope',
		function ($scope) {

			var arr = [];

			var urlBase = 'http://local.dev/playground/imageCreator/dev/app/image.php';
			var color = '%23DBA97D';

			for (var i = 1; i <= 12; i++) {
				var rand = Math.floor( Math.random() * 200 + 200 );
				arr.push( {"url": urlBase + "?w=300&h=" + rand + "&color=" + color + "&text=Photo" + i } );
			}

			$scope.photos = arr;
		}]);