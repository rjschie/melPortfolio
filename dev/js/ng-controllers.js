'use strict';

angular.module('app.controllers', [])

.controller('BaseController', ['$scope', '$state',
	function($scope, $state) {
		$scope.$state = $state;
	}]);
