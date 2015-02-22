'use strict';

angular.module('app.services', [])
.factory('Task', ['$resource',
	function($resource) {
		return $resource("../api/tasks/:id", { id: '@id' }, {
			update : {
				method : 'PUT'
			}
		});
	}]);