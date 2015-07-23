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
		key: 'reduce_indentation',

		// remove some tabs in the beginning
		value: function reduce_indentation(line, how_much) {
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
		key: 'extract_tabulation',
		value: function extract_tabulation(lines) {
			var _this = this;

			lines = lines
			// preserve line indexes
			.map(function (line, index) {
				return { line: line, index: index };
			})
			// filter out blank lines
			.filter(function (line) {
				return !(0, _helpers.is_blank)(line.line);
			});

			// calculate each line's indentation
			lines.forEach(function (line) {
				var tabs = _this.calculate_indentation(line.line);
				var pure_line = _this.reduce_indentation(line.line, tabs);

				// check for messed up space indentation
				if ((0, _helpers.starts_with)(pure_line, ' ')) {
					var reason = undefined;
					if (_this.tab.symbol === '\t') {
						reason = 'mixed tabs and spaces';
					} else {
						reason = 'extra leading spaces';
					}

					throw new Error('Invalid indentation (' + reason + ') at line ' + line.index + ': "' + _this.reveal_whitespace(line.line) + '"');
				}

				// check for tabs in spaced intentation
				if ((0, _helpers.starts_with)(pure_line, '\t')) {
					var reason = undefined;
					if (_this.tab.symbol === '\t') {
						reason = 'extra leading tabs';
					} else {
						reason = 'mixed tabs and spaces';
					}

					throw new Error('Invalid indentation (' + reason + ') at line ' + line.index + ': "' + _this.reveal_whitespace(line.line) + '"');
				}

				line.tabs = tabs;
				line.original_line = line.line;
				line.line = pure_line;
			});

			// get the minimum indentation level
			var minimum_indentation = lines.reduce(function (minimum, line) {
				return Math.min(minimum, line.tabs);
			}, Infinity);

			/* istanbul ignore else: do nothing on else */
			// if there is initial tabulation missing - add it
			if (minimum_indentation === 0) {
				lines.forEach(function (line) {
					line.tabs++;
				});
			}
			// if there is excessive tabulation - trim it
			else if (minimum_indentation > 1) {
				lines.forEach(function (line) {
					line.tabs -= minimum_indentation - 1;
				});
			}

			// check for messed up tabulation
			if (lines[0].tabs !== 1) {
				throw new Error('Invalid indentation at line ' + lines[0].index + ': "' + lines[0].original_line + '"');
			}

			return lines;
		}
	}, {
		key: 'reveal_whitespace',
		value: function reveal_whitespace(text) {
			var whitespace_count = text.length - text.replace(/^\s*/, '').length;

			var whitespace = text.substring(0, whitespace_count + 1).replace(this.tab.regexp_anywhere, '[indent]').replace(/ /g, '[space]').replace(/\t/g, '[tab]');

			var rest = text.substring(whitespace_count + 1);

			return whitespace + rest;
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

	function is_tabulated(line) {
		// if we're using tabs for tabulation
		if ((0, _helpers.starts_with)(line, '\t')) {
			var _tab = {
				symbol: '\t',
				regexp: new RegExp('^(\t)+', 'g'),
				regexp_anywhere: new RegExp('(\t)+', 'g')
			};

			return _tab;
		}
	}

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
	if (lines.length === 0) {
		throw new Error('Couldn\'t decide on tabulation type. Not enough lines.');
	}

	/* istanbul ignore next: not a probable case in styles scenario */
	if (lines.length === 1) {
		var _tab2 = is_tabulated(lines[0]);
		if (_tab2) {
			return _tab2;
		}

		return calculate_leading_spaces(lines[0]);
	}

	// if we're using tabs for tabulation
	var tab = is_tabulated(lines[1]);
	if (tab) {
		return tab;
	}

	// take the first two lines,
	// calculate their indentation,
	// substract it and you've got the tab width
	var tab_width = Math.abs(substract(lines.slice(0, 2).map(calculate_leading_spaces)));

	if (tab_width === 0) {
		throw new Error('Couldn\'t decide on tabulation type. Same indentation.');
	}

	var symbol = (0, _helpers.repeat)(' ', tab_width);

	var spaced_tab = {
		symbol: symbol,
		regexp: new RegExp('^(' + symbol + ')+', 'g'),
		regexp_anywhere: new RegExp('(' + symbol + ')+', 'g')
	};

	return spaced_tab;
};
module.exports = exports['default'];