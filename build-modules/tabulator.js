'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

// tabulation utilities

var Tabulator = (function () {
	function Tabulator(tab) {
		_classCallCheck(this, Tabulator);

		this.tab = tab;
	}

	_createClass(Tabulator, [{
		key: 'tabulate',

		// // has tab in the beginning
		// is_tabulated(line)
		// {
		// 	return starts_with(line, this.tab.symbol)
		// }

		// add one tab in the beginning
		value: function tabulate(line) {
			var how_much = arguments[1] === undefined ? 1 : arguments[1];

			return (0, _helpers.repeat)(this.tab.symbol, how_much) + line;
		}
	}, {
		key: 'reduce_tabulation',

		// remove some tabs in the beginning
		value: function reduce_tabulation(line) {
			var how_much = arguments[1] === undefined ? 1 : arguments[1];

			return line.substring(this.tab.symbol.length * how_much);
		}
	}, {
		key: 'calculate_indentation',

		// how many "tabs" are there before content of this line
		value: function calculate_indentation(line) {
			var matches = line.match(this.tab.regexp);

			if (!matches) {
				return 0;
			}

			return matches[0].length / this.tab.symbol.length;
		}
	}, {
		key: 'normalize_initial_tabulation',
		value: function normalize_initial_tabulation(lines) {
			var _this = this;

			// filter out blank lines,
			// calculate each line's indentation,
			// and get the minimum one
			var minimum_indentation = lines.filter(function (line) {
				return !(0, _helpers.is_blank)(line);
			}).map(function (line) {
				return _this.calculate_indentation(line);
			}).reduce(function (minimum, indentation) {
				return Math.min(minimum, indentation);
			}, Infinity);

			// if there is initial tabulation missing - add it
			if (minimum_indentation === 0) {
				lines = lines.map(function (line) {
					return _this.tabulate(line);
				});
			}
			// if there is excessive tabulation - trim it
			else if (minimum_indentation > 1) {
				lines = lines.map(function (line) {
					return _this.reduce_tabulation(line, minimum_indentation - 1);
				});
			}

			return lines;
		}
	}]);

	return Tabulator;
})();

exports['default'] = Tabulator;

// decide whether it's tabs or spaces
Tabulator.determine_tabulation = function (lines) {
	var substract = function substract(pair) {
		return pair[0] - pair[1];
	};

	function calculate_leading_spaces(line) {
		var counter = 0;
		line.replace(/^( )+/g, function (match) {
			counter = match.length;
		});
		return counter;
	}

	// take all meaningful lines
	lines = lines.filter(function (line) {
		return !(0, _helpers.is_blank)(line);
	});

	// has to be at least two of them
	if (lines.length < 2) {
		throw new Error('Couldn\'t decide on tabulation type. Not enough lines.');
	}

	// if we're using tabs for tabulation
	if ((0, _helpers.starts_with)(lines[1], '\t')) {
		var tab = {
			symbol: '\t',
			regexp: new RegExp('^(\t)+', 'g')
		};

		return tab;
	}

	// take the first two lines,
	// calculate their indentation,
	// substract it and you've got the tab width
	var tab_width = Math.abs(substract(lines.slice(0, 2).map(calculate_leading_spaces)));

	if (tab_width === 0) {
		throw new Error('Couldn\'t decide on tabulation type. Invalid tabulation.');
	}

	var symbol = (0, _helpers.repeat)(' ', tab_width);

	var spaced_tab = {
		symbol: symbol,
		regexp: new RegExp('^(' + symbol + ')+', 'g')
	};

	return spaced_tab;
};
module.exports = exports['default'];