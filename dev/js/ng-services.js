'use strict';

angular.module('app.services', [])
.factory('Photo', ['$resource',
	function($resource) {
		return $resource("../api/photos/:id", { id: '@id' }, {
			update : {
				method : 'PUT'
			}
		});
	}]);