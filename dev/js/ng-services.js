'use strict';

angular.module('app.services', [])
.factory('Photography', ['$resource',
	function($resource) {
		return $resource("../api/photo_galleries/:slug", { slug: '@slug' });
	}])

.factory('PhotographyRandom', ['$resource',
	function($resource) {
		return $resource('../api/photo_random');
	}])

.factory('DesignGallery', ['$resource',
	function($resource) {
		return $resource('../api/design_galleries/:slug', { slug : '@slug' });
	}])
;