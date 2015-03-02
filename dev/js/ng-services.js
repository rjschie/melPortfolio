'use strict';

angular.module('app.services', [])
.factory('Photography', ['$resource',
	function($resource) {
		return $resource("../api/photo_galleries/:slug", { slug: '@slug' });
	}])

.factory('DesignGallery', ['$resource',
	function($resource) {
		return $resource('../api/design_galleries/:slug', { slug : '@slug' });
	}])
;