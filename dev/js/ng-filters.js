
angular.module('app.filters', [])

.filter('parseMB', function() {
		return function(input) {
			input = input || '';
			output = '';

			output = parseFloat(input).toFixed(2);
			output += ' MB';

			return output;
		};
	});