'use strict';

angular.module('app.services', [])

.factory('AuthServ', ['$http', '$q', '$window',
	function($http, $q, $window) {

		function login(email, password) {
			var deferred = $q.defer();

			$http.post("../api/login", {
				email: email,
				password: password
			}).then(function(res) {
				var sessionInfo = { token : res.data.token };
				$window.localStorage['sessionInfo'] = JSON.stringify(sessionInfo);
				deferred.resolve(sessionInfo);
			}, function(res) {

				switch(res.data.error) {
					case 'invalid_credentials':
						res.data.error = "Wrong username or password.";
						break;
					default:
						res.data.error = "Couldn't Log In.";
						break;
				}
				deferred.reject(res);
			});

			return deferred.promise;
		}

		return {
			login: login,
			logout: function() {
				delete $window.localStorage.sessionInfo;
				return ($window.localStorage.sessionInfo) ? true : false;
			},
			isAuth: function() {
				return ($window.localStorage.sessionInfo)
								? JSON.parse($window.localStorage.sessionInfo).hasOwnProperty('token')
								: false;
			}
		};

	}])

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