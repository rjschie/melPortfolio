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
		return $resource('../api/design_galleries/:id', { id : '@id' },
			{ update : {method:'PUT'} });
	}])

.factory('DesignEntry', ['$resource',
	function($resource) {
		return $resource('../api/design_entries/:id', { id : '@id' });
	}])

.factory('InstagramFeed', ['$http',
	function($http) {
		return {
			get: function (callback) {
				var endPoint = 'https://api.instagram.com/v1/users/328782452/media/recent/?client_id=6c30a75a54da4efa8343ef682a86995a&count=3&callback=JSON_CALLBACK';

				$http.jsonp(endPoint).success(function(response) {
					callback(response.data);
				});
			}
		};
	}])
;